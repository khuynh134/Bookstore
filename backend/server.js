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

// handle request for author's name and books using authorID
app.get('/author', async (re, res) => {
    const authorID = re.query.authorID;
    console.log(`receive request for author id = ${authorID}`)

    try{
        // query database for author's name
        let [result] = await db.execute(`SELECT AuthorName FROM Author WHERE AuthorID = ?`, [authorID]);
        const authorName = (result && result.length != 0)? result[0].AuthorName : "";
        console.log(`  Found author name: ${authorName}`);

        // Query database for books related to the author
        const books = [];
        [result] = await db.execute(`SELECT BookID FROM Book_Author WHERE AuthorID = ?`, [authorID]);
        console.log(`  Found ${result.length} books`);
        for (const id of result) {
            const [result] = await db.execute(`SELECT * FROM Book WHERE BookID = ?`, [id.BookID]);
            if (result && result.length != 0){
                books.push(result[0]);
                console.log(`  got book data for bookID = ${result[0].BookID}`)
            }
        }
        res.json({authorName, books});
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})