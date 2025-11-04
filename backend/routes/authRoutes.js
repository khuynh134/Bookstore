import express from 'express';
import {connectToDatabase} from '../lib/db.js' 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const router = express.Router()

//register 
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body || {};
    // Basic input validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }

    try {
        console.log('Registering user:', username, email);
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'user already existed' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashPassword]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Logging the full error to help with debugging
        console.error('Error in /auth/register:', error);
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
})

//log in 
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    // Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }

    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'user does not exist' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }
    // Sign the JWT with the database's primary key column name (`user_id`)
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_KEY, { expiresIn: '5h' });

    // If login is successful, return user information and token
    return res.status(200).json({ message: 'Login successful', user: { user_id: user.user_id, email: user.email }, token });
    
    } catch (error) {
        console.error('Error in /auth/login:', error);
        res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
})

const verifyToken = async (req, res, next) => {
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
        // Handle token-specific errors with clearer messages
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

//return user information
router.get('/profile', verifyToken, async (req, res) => {
    try{
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE user_id =? ', [req.userId]);
        if ( rows.length === 0) {
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({user: rows[0]})
    } catch (error) {
        console.error('Error in /auth/profile:', error);
        return res.status(500).json({message: 'server error', detail: error.message});
    }
})

//logout implementation by clearing refresh token 
router.post('/logout', (req, res) => {
    //if there is any refresh token cookie, clear it
    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'lax', secure: false});
    // removing refresh tokens server-side from db.
    return res.status(200).json({ message: 'Logged out successfully' });
})

export default router;