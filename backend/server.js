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
    const pageSize = (re.query.pageSize)? parseInt(re.query.pageSize) : 24;
    const offset = (re.query.page)? (parseInt(re.query.page)- 1)* pageSize : 0;
    console.log(`receive request of query ${keyword} for pageSize = ${pageSize} and derived offset = ${offset}`)
    let result = null;
    let hasNext = false;
    try{
        [result] = await db.execute(`SELECT * FROM Book 
            WHERE Title LIKE ? 
            ORDER BY BookID 
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

    // Query authors of the books, book.authors will contain {AuthorID, AuthorName}
    for (const book of result) {
        const [ids] = await db.execute(`SELECT AuthorID FROM Book_Author WHERE BookID = ?`, [book.BookID]);
        // match AuthorName with their AuthorId for each book
        book.Authors = [];
        for (const id of ids) {
            const [authorName] = await db.execute(`SELECT AuthorName FROM Author WHERE AuthorID = ?`, [id.AuthorID]);
            book.Authors.push({AuthorID: id.AuthorID, AuthorName : authorName[0].AuthorName});
        }
    }
    
    res.json({result, hasNext});
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