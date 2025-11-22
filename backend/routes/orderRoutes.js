import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../lib/db.js';

const router = express.Router();

// verifyToken 
const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        if( !authHeader ) return res.status(403).json({ message: 'No Authorization header provided' });

        const parts = authHeader.split(' ');
        if ( parts.length !== 2 || parts[0] !== 'Bearer'){
            return res.status(400).json({message: 'Malformed Authorization header'});
        }

        const token = parts[1];
        if (!token) return res.status(403).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.user_id;
        next();
    } catch (error){
        if ( error && error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
        if ( error && error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });

        console.error('Error in verifyToken middleware:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}; 

// POST /api/orders 
router.post('/', verifyToken, async (req, res) => {
    const db = await connectToDatabase();
    const userId = req.userId;
    const { items = [], shipping_address = null, payment_info = null, cart_id = null, shipping_cents = 0, tax_cents = 0, currency = 'USD' } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Compute subtotal 
    const subtotal_cents = items.reduce((sum, it) => {
        const unit = Number(it.unit_price_cents ?? Math.round((it.unit_price ?? 0) * 100)) || 0;
        const qty = Number(it.quantity || 0) || 0;
        return sum + unit * qty; 
    }, 0);

    // compute total using numeric shipping_cents and tax_cents (both are cents)
    const total_cents = subtotal_cents + (Number(shipping_cents) || 0) + (Number(tax_cents) || 0);

    // Serialize address and payment info 
    const shippingJson = shipping_address ? JSON.stringify(shipping_address) : null;
    const paymentLast4 = payment_info?.last4 ?? null;
    const paymentBrand = payment_info?.brand ?? null;                               // e.g., 'Visa', 'MasterCard'
    const paymentToken = payment_info?.token ?? null;
    const paymentStatus = payment_info?.status ?? 'pending';

    try{
        await db.beginTransaction();

        const [orderInsert] = await db.query(
            `INSERT INTO orders
            (user_id, cart_id, status, currency, subtotal_cents, shipping_cents, tax_cents, total_cents,
                payment_last4, payment_brand, payment_token, payment_status, shipping_address)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                cart_id,
                paymentStatus === 'paid' ? 'processing' : 'pending',
                currency,
                subtotal_cents,
                shipping_cents,
                tax_cents,
                total_cents,
                paymentLast4,
                paymentBrand,
                paymentToken,
                paymentStatus,
                shippingJson
            ]
        );

        const orderId = orderInsert.insertId;

        // insert items
        for (const it of items){
            const bookId = it.book_id ?? it.BookID ?? it.bookId;
            const qty = Number(it.quantity || 0) || 0;
            const unitPriceCents = Number(it.unit_price_cents ?? Math.round((it.unit_price ?? 0) * 100)) || 0;
        
            await db.query(
                'INSERT INTO order_items (order_id, book_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)',
                [orderId, bookId, qty, unitPriceCents]
            );
        }

        // Mark cart as converted / clear cart items
        // If frontend didn't supply `cart_id`, try to find the user's active cart and clear that.
        let resolvedCartId = cart_id;
        if (!resolvedCartId) {
            const [userCarts] = await db.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
            if (userCarts && userCarts.length > 0) resolvedCartId = userCarts[0].id;
        }

        if (resolvedCartId) {
            try{
                await db.query('UPDATE carts SET status = ? WHERE id = ?', ['converted', resolvedCartId]);
                await db.query('DELETE FROM cart_items WHERE cart_id = ?', [resolvedCartId]);
            } catch (error) {
                console.warn('Cart cleanup failed', error);
            }
        }

        await db.commit();

        // return created order summary and items
        const [orderRows] = await db.query('SELECT order_id, status, currency, subtotal_cents, shipping_cents, tax_cents, total_cents, payment_last4, payment_brand, payment_status, shipping_address, created_at FROM orders WHERE order_id = ?', [orderId]);
        const [orderItems] = await db.query('SELECT id, order_id, book_id, quantity, unit_price_cents FROM order_items WHERE order_id = ?', [orderId]);
        
        return res.status(201).json({ order: orderRows[0], items: orderItems });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: error?.message || 'Failed to create order' });
    }     
});
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userId = req.userId;

    const [rows] = await db.query(
      `SELECT 
          o.order_id,
          o.status,
          o.currency,
          o.subtotal_cents,
          o.shipping_cents,
          o.tax_cents,
          o.total_cents,
          o.payment_status,
          o.created_at,
          COALESCE(SUM(oi.quantity), 0) AS total_quantity
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       WHERE o.user_id = ?
       GROUP BY 
          o.order_id,
          o.status,
          o.currency,
          o.subtotal_cents,
          o.shipping_cents,
          o.tax_cents,
          o.total_cents,
          o.payment_status,
          o.created_at
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    return res.status(500).json({ message: 'Failed to load orders' });
  }
});

// GET -> full order details
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userId = req.userId;
    const orderId = req.params.orderId;

    // ensure user owns this order
    const [orderRows] = await db.query(
      `SELECT 
        order_id,
        status,
        currency,
        subtotal_cents,
        shipping_cents,
        tax_cents,
        total_cents,
        payment_last4,
        payment_brand,
        payment_status,
        shipping_address,
        created_at
      FROM orders
      WHERE order_id = ? AND user_id = ?
      LIMIT 1`,
      [orderId, userId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }


    const [items] = await db.query(
      `SELECT 
        oi.book_id,
        b.Title,
        b.BookCoverURL,
        oi.quantity,
        oi.unit_price_cents
      FROM order_items oi
      JOIN book b ON b.BookID = oi.book_id
      WHERE oi.order_id = ?`,
      [orderId]
    );

    return res.json({
      order: orderRows[0],
      items
    });

  } catch (error) {
    console.error("Order details error:", error);
    res.status(500).json({ message: "Failed to load order details" });
  }
});


export default router; 
