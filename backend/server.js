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
)

app.get('/', (re, res) =>{
    res.json("Backend of bookstore");
})

// search on book title
app.get('/api/s', (re, res) => {
    const keyword = re.query.keyword;
    console.log(`receive request of parameter ${keyword}`)
    db.execute(`SELECT * FROM Book WHERE Title LIKE ?`, [`%${keyword}%`], (error, result) => {
        if(error){
            res.status(500).json({error: error.message});
        }
        console.log("finish pulling database");
        res.json({result});
    });
})

app.listen(PORT, () => {
    console.log(`listening to http://localhost:${PORT}`);
})