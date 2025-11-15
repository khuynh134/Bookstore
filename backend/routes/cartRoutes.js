import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../lib/db.js';

const router = express.Router();

// Verify JWT token
const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader) {
            return res.status(403).json({message: 'No Authorization header provided'});
        }

        const parts = authHeader.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer'){
            return res.status(400).json({message: 'Malformed Authorization header'});
        }

        const token = parts[1];
        if(!token){
            return res.status(403).json({message: 'No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.user_id;
        next();
    } catch (error){
        console.error('Error in verifyToken middleware:', error);
        return res.status(401).json({message: 'Unauthorized'});
    }
};

// Get user's cart items
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId;

    try{
        const db = await connectToDatabase();

        //get cart 
        const [carts] = await db.query('SELECT id FROM carts WHERE user_id =?',
            [userId]
        );

        if(carts.length === 0){
            return res.status(200).json({currency: 'USD', items: []});
        }

        const cartId = carts[0].id;

        const [rows] = await db.query(`
            SELECT 
                ci.id AS item_id,
                ci.book_id,
                b.Title,
                b.BookCoverURL,
                ci.quantity,
                (ci.unit_price_cents / 100) AS unit_price,
                (ci.quantity * (ci.unit_price_cents / 100)) AS line_total

            FROM cart_items ci
            JOIN book b ON b.BookID = ci.book_id
            WHERE ci.cart_id = ?
            ORDER BY ci.id DESC
        `, [cartId]);

        res.json({ currency: 'USD', items: rows });
    } catch (err){
        console.error('Cart route error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
    const userId = req.userId;
    const { book_id, quantity = 1, unit_price_cents } = req.body;

    if(!book_id || !unit_price_cents){
        return res.status(400).json({ message: 'need book_id and unit_price_cents'});
    }

    try{
        const db = await connectToDatabase();

        // Get or create a cart for the user
        let [carts] = await db.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );

        let cartId;
        if(carts.length === 0){
            const [result] = await db.query(
                'INSERT INTO carts (user_id, status, currency, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [userId, 'active', 'USD']
            );
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }
        // Check if the cart has the book already
        const [existingItems] = await db.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND book_id = ?',
            [cartId, book_id]
        );

        if(existingItems.length > 0 ){
            // Update quantity of item if it exists
            const newQuantity = existingItems[0].quantity + quantity;
            await db.query(
                'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
                [newQuantity, existingItems[0].id]
            );
        } else {
            // Insert new item into cart
            await db.query(
                'INSERT INTO cart_items (cart_id, book_id, quantity, unit_price_cents, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [cartId, book_id, quantity, unit_price_cents]
            );
        }
        
        res.status(200).json({
            message: 'Item added to cart successfully',
            cart_id: cartId
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

//Delete item from cart
router.delete('/items/:itemId', verifyToken, async (req, res) => {
    const itemId = Number(req.params.itemId);
    const userId = req.userId;

    try{
        const db = await connectToDatabase();

        // get cart 
        const [carts] = await db.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        ); 

        if( carts.length === 0){
            return res.status(404).json({ ok: false, error: 'No cart found for user' });
        }

        const cartId = carts[0].id;

        //delete item
        const [result] = await db.query(
            'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
            [itemId, cartId]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({ ok: false, error: 'Item not found for this cart' });
        }
        
        res.json({ ok: true, deletedId: itemId, affectedRows: result.affectedRows });
    } catch (error){
        console.error('Delete item error:', error);
        res.status(500).json({ ok: false, error: 'Failed to remove item' });
    }
});

// Update item quantity in cart
router.patch('/items/:itemId', verifyToken, async (req, res) => {
    const itemId = Number(req.params.itemId);
    const userId = req.userId;
    let { quantity } = req.body;

    quantity = Number(quantity);
    if(!Number.isFinite(quantity) || quantity < 1){
        return res.status(400).json({ error: 'Quantity must be >= 1' });
    }

    try{
        const db = await connectToDatabase();

        //get the cart 
        const [carts] = await db.query(
            'SELECT id FROM carts WHERE user_id = ?',
            [userId]
        );

        if( carts.length === 0){
            return res.status(404).json({ error: 'No cart found for user' });
        }

        const cartId = carts[0].id;

        // update book quantity
        const [result] = await db.query(
            'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ? AND cart_id = ?',
            [quantity, itemId, cartId]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({ error: 'Item not found for this cart' });
        }

        // Return the update cart items
        const [rows] = await db.query(`
            SELECT 
                ci.id AS item_id,
                ci.book_id,
                b.Title,
                b.BookCoverURL,
                ci.quantity,
                (ci.unit_price_cents / 100) AS unit_price,
                (ci.quantity * (ci.unit_price_cents / 100)) AS line_total

            FROM cart_items ci
            JOIN book b ON b.BookID = ci.book_id
            WHERE ci.cart_id = ?
            ORDER BY ci.id DESC
        `, [cartId]);
        
        res.json({ currency: 'USD', items: rows });
    } catch (error){
        console.error('Update quantity error:', error);
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});    

export default router;