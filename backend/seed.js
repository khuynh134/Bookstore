/* Populate the database with sample data. simply run with the command node seed.js*/
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_USER)

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}
)

db.query('CREATE DATABASE IF NOT EXISTS Bookstore');
db.query('USE Bookstore');

db.query('DROP TABLE IF EXISTS Book')
db.query(`CREATE TABLE IF NOT EXISTS Book 
    (BookID INT NOT NULL,
    Title VARCHAR(50) NOT NULL,
    ISBN BIGINT NOT NULL,
    Price DEC(10,2) NOT NULL,
    Stock INT,
    BookCoverURL VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY(BookID),
    UNIQUE(ISBN))`);
db.query(`INSERT INTO Book (BookID, Title, ISBN, Price, Stock, BookCoverURL)
    VALUES 
    (1, 'The Complete Novel of Sherlock Holmes', 9780553328257, 7.89, 3, '/book_covers/9780553328257.jpg'),
    (2, 'The Kite Runner', 9781594631931, 8.31, 5, NULL)
    `);
db.commit()
console.log("Done")