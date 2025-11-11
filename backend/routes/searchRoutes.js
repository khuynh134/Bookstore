import express from 'express';
import {connectToDatabase} from '../lib/db.js' 

const router = express.Router();

// helper function that split the the AuthorID and AuthorName strings of each object in list
function splitAuthorStrings(books){
    for (const book of books) {
        book.AuthorID = (book.AuthorID)? book.AuthorID.split(',') : [];
        book.AuthorName = (book.AuthorName)? book.AuthorName.split(',') : [];
    }
}

// handle search for books with title containing the keyword
router.get('/', async (re, res) => {
        const db = await connectToDatabase();
        const keyword = re.query.keyword;
        const pageSize = (re.query.pageSize)? parseInt(re.query.pageSize) : 24;
        const offset = (re.query.page)? (parseInt(re.query.page)- 1)* pageSize : 0;
        console.log(`receive request of query ${keyword} for pageSize = ${pageSize} and derived offset = ${offset}`)
        let books = null;
        let hasNext = false;
        try{
            [books] = await db.execute(`SELECT
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
            hasNext = books.length > pageSize;
            if (hasNext){
                books = books.slice(0, -1)
            }
            console.log(`Found ${books.length} books and hasNext = ${hasNext}`)
        }catch(error){
            res.status(500).json({error: error.message});
        }

        splitAuthorStrings(books);
        
        res.json({books, hasNext});
    }
);

// handle request for author's name and books using authorID
router.get('/author', async (re, res) => {
    const db = await connectToDatabase();
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
        splitAuthorStrings(books);

        console.log(`  Found ${books.length} books`);
        res.json({authorName, books});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

// handle request for books within certain category
router.get('/category', async (re, res) => {
        const db = await connectToDatabase();
        const category = re.query.category;
        const pageSize = (re.query.pageSize)? parseInt(re.query.pageSize) : 24;
        const offset = (re.query.page)? (parseInt(re.query.page)- 1)* pageSize : 0;
        console.log(`Receive request for category ${category} for pageSize = ${pageSize} and derived offset = ${offset}`)
        let books = null;
        let hasNext = false;
        try{
            [books] = await db.execute(`SELECT
                Selection.*,
                GROUP_CONCAT(Author.AuthorID) as AuthorID,
                GROUP_CONCAT(Author.AuthorName) as AuthorName
                FROM (SELECT * FROM Book WHERE Category LIKE ?) AS Selection
                LEFT JOIN Book_Author ON Book_Author.BookID = Selection.BookID
                LEFT JOIN Author ON Book_Author.AuthorID = Author.AuthorID
                GROUP BY Selection.BookID
                ORDER BY Selection.BookID 
                LIMIT ? OFFSET ?`, 
                [`%${category}%`, String(pageSize + 1), String(offset)]); 
            //check if there is next book
            hasNext = books.length > pageSize;
            if (hasNext){
                books = books.slice(0, -1)
            }
            console.log(`  Found ${books.length} books and hasNext = ${hasNext}`)
        }catch(error){
            res.status(500).json({error: error.message});
        }

        splitAuthorStrings(books);

        res.json({books, hasNext});
    }
);

export default router;