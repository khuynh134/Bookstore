/* To start, use the command npm start within the folder */
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js';
import searchRouter from './routes/searchRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import ordersRouter from './routes/orderRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8081

// Allow CORS from the frontend and allow credentials so cookies can be set/cleared
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', authRouter);

app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
).promise()

app.get('/', (re, res) =>{
    res.json("Backend of bookstore");
})

// search for books with certain keyword in titles, or authorID with /author, or category /category
app.use('/s', searchRouter);

app.get('/api/cart', async (req, res) => {
  const cartId = Number(req.query.cart_id || 1); // default to 1 if not specified

  try {
    const [rows] = await db.execute(`
      SELECT 
        ci.id AS item_id,
        ci.book_id,
        b.Title,
        b.BookCoverURL,
        ci.quantity,
        (ci.unit_price_cents / 100) AS unit_price,
        (ci.quantity * (ci.unit_price_cents / 100)) AS line_total
      FROM cart_items ci
      JOIN book b ON b.BookID = ci.book_id   -- note: lowercase 'book'
      WHERE ci.cart_id = ?
      ORDER BY ci.id DESC
    `, [cartId]);

    res.json({ currency: 'USD', items: rows });
  } catch (err) {
    console.error('Cart route error:', err);
    res.status(500).json({ error: err.message });
  }
});



app.delete('/api/cart/items/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const cartId = Number(req.query.cart_id || 1);

  try {
    const [result] = await db.execute(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'Item not found for this cart' });
    }


    
    return res.json({ ok: true, deletedId: itemId, affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Delete item error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to remove item' });
  }
});


app.patch('/api/cart/items/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const cartId = Number(req.query.cart_id || 1);
  let { quantity } = req.body;

  
  quantity = Number(quantity);
  if (!Number.isFinite(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be >= 1' });
  }

  try {
    
    const [result] = await db.execute(
      'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ? AND cart_id = ?',
      [quantity, itemId, cartId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found for this cart' });
    }

    
    const [rows] = await db.execute(`
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

    return res.json({ currency: 'USD', items: rows });
  } catch (err) {
    console.error('Update quantity error:', err);
    return res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// Handle request for stock of a book with bookID
app.get('/stock', async (re, res) => {
        const id = re.query.bookID;
        console.log(`Receive request for stock of book ID ${id}`)
        let stock = null;
        try{
            const [result] = await db.execute(`SELECT Stock FROM Book WHERE BookID = ?`, [id]);
            stock = (result && result.length != 0)? result[0].Stock : 0;
        }catch(error){
            res.status(500).json({error: error.message});
        }
        res.json({stock});
    }
);


app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})