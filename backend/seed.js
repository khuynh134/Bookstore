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
    PRIMARY KEY(BookID),
    UNIQUE(ISBN))`);
db.query(`INSERT INTO Book (BookID, Title, ISBN, Price, Stock)
    VALUES 
    (1, 'The Complete Novel of Sherlock Holmes', 0553328255, 7.89, 3),
    (2, 'The Kite Runner', 9781594631931, 8.31, 5)
    `);
db.commit()
console.log("Done")