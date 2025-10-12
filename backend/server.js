/* To start, use the command npm start within the folder */
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()
const PORT = 8081

app.use(cors())
dotenv.config()

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
    console.log(`receive request of query ${keyword}`)
    let result = null;
    try{
        [result] = await db.execute(`SELECT * FROM Book WHERE Title LIKE ?`, [`%${keyword}%`]);
        console.log("finish pulling book lists");
    }catch(error){
        res.status(500).json({error: error.message});
    }

    // Query authors of the book, book.authors will contain {AuthorID, AuthorName}
    for (const book of result) {
        const [ids] = await db.execute(`SELECT AuthorID FROM Book_Author WHERE BookID = ?`, [book.BookID]);
        console.log("finish pulling matching author ids");

        book.Authors = [];
        for (const id of ids) {
            console.log(`look for author with ID ${id.AuthorID}`);
            const [authorName] = await db.execute(`SELECT AuthorName FROM Author WHERE AuthorID = ?`, [id.AuthorID]);
            console.log(authorName[0].AuthorName);
            book.Authors.push({AuthorID: id.AuthorID, AuthorName : authorName[0].AuthorName});
        }
    }
    res.json({result});
})

app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})