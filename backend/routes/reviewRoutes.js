import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../lib/db.js';

const router = express.Router();

// verifyToken 
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'No Authorization header provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(400).json({ message: 'Malformed Authorization header' });
    }

    const token = parts[1];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.user_id;
    next();
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Error in verifyToken middleware:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


// list all reviews for a specific book
router.get('/book/:bookId', async (req, res) => {
  const bookId = Number(req.params.bookId);
  if (!Number.isFinite(bookId)) {
    return res.status(400).json({ message: 'Invalid book id' });
  }

  try {
    const db = await connectToDatabase();

    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.user_id,
        u.username,
        r.book_id,
        r.rating,
        r.comment,
        r.created_at
    FROM reviews r
    JOIN users u ON u.user_id = r.user_id
    WHERE r.book_id = ?
    ORDER BY r.created_at DESC
      `,
      [bookId]
    );

    return res.json({ reviews: rows });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Failed to load reviews' });
  }
});


// create a new review for a book [logged-in user]
router.post('/book/:bookId', verifyToken, async (req, res) => {
  const bookId = Number(req.params.bookId);
  if (!Number.isFinite(bookId)) {
    return res.status(400).json({ message: 'Invalid book id' });
  }

  const { rating, comment } = req.body;
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const db = await connectToDatabase();

    // ensure the book actually exists
    const [books] = await db.query(
      'SELECT BookID FROM book WHERE BookID = ?',
      [bookId]
    );
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const [result] = await db.query(
      `
      INSERT INTO reviews (user_id, book_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [req.userId, bookId, numericRating, comment || null]
    );

    return res.status(201).json({
      message: 'Review created',
      review: {
        id: result.insertId,
        user_id: req.userId,
        book_id: bookId,
        rating: numericRating,
        comment: comment || null,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Failed to create review' });
  }
});


router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const userId = req.userId;

    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.book_id,
        b.Title AS book_title,
        GROUP_CONCAT(a.AuthorName ORDER BY a.AuthorName SEPARATOR ', ') AS author_name,
        r.rating,
        r.comment,
        r.created_at
      FROM reviews r
      JOIN book b ON b.BookID = r.book_id
      JOIN book_author ba ON ba.BookID = b.BookID
      JOIN author a ON a.AuthorID = ba.AuthorID
      WHERE r.user_id = ?
      GROUP BY 
        r.id,
        r.book_id,
        b.Title,
        r.rating,
        r.comment,
        r.created_at
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return res.status(500).json({ message: 'Failed to load review history' });
  }
});

export default router;
