/* To start, use the command npm start within the folder */
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8081

// Allow CORS from the frontend and allow credentials so cookies can be set/cleared
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/auth', authRouter);

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

// search on book title
app.get('/api/s', async (re, res) => {
    const keyword = re.query.keyword;
    const pageSize = (re.query.pageSize)? parseInt(re.query.pageSize) : 24;
    const offset = (re.query.page)? (parseInt(re.query.page)- 1)* pageSize : 0;
    console.log(`receive request of query ${keyword} for pageSize = ${pageSize} and derived offset = ${offset}`)
    let result = null;
    let hasNext = false;
    try{
        [result] = await db.execute(`SELECT
            Book.*,
            GROUP_CONCAT(Author.AuthorID) as AuthorID,
            GROUP_CONCAT(Author.AuthorName) as AuthorName
            FROM Book 
            LEFT JOIN Book_Author ON Book_Author.BookID = Book.BookID
            LEFT JOIN Author ON Book_Author.AuthorID = Author.AuthorID
            WHERE Title LIKE ? 
            GROUP BY Book.BookID
            ORDER BY Book.BookID 
            LIMIT ? OFFSET ?`, 
            [`%${keyword}%`, String(pageSize + 1), String(offset)]); 
        //check if there is next book
        hasNext = result.length > pageSize;
        if (hasNext){
            result = result.slice(0, -1)
        }
        console.log(`Found ${result.length} books and hasNext = ${hasNext}`)
    }catch(error){
        res.status(500).json({error: error.message});
    }

    for (const book of result) {
        book.AuthorID = (book.AuthorID)? book.AuthorID.split(',') : [];
        book.AuthorName = (book.AuthorName)? book.AuthorName.split(',') : [];
    }
    
    res.json({result, hasNext});
})

// handle request for author's name and books using authorID
app.get('/author', async (re, res) => {
    const authorID = re.query.authorID;
    console.log(`receive request for author id = ${authorID}`)

    try{
        // query database for author's name
        let [result] = await db.execute(`SELECT AuthorName 
            FROM Author WHERE AuthorID = ?`, [authorID]);
        const authorName = (result && result.length != 0)? result[0].AuthorName : "";
        console.log(`  Found author name: ${authorName}`);

        // Query database for books related to the author
        const [books] = await db.execute(`SELECT 
            Book.*,
            GROUP_CONCAT(Author.AuthorID) as AuthorID,
            GROUP_CONCAT(Author.AuthorName) as AuthorName
            FROM (SELECT DISTINCT BookID FROM Book_Author WHERE AuthorID = ? ) AS Selection
            JOIN Book ON Book.BookID = Selection.BookID
            JOIN Book_Author ON Selection.BookID = Book_Author.BookID
            JOIN Author ON Author.AuthorID = Book_Author.AuthorID
            GROUP BY Book.BookID`, [authorID]);
        // process the the authorID and authorName into list
        for (const book of books) {
            book.AuthorID = (book.AuthorID)? book.AuthorID.split(',') : [];
            book.AuthorName = (book.AuthorName)? book.AuthorName.split(',') : [];
        }

        console.log(`  Found ${books.length} books`);
        res.json({authorName, books});
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

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




app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})