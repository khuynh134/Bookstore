/* To start, use the command npm start within the folder */
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()
app.use(cors())

dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
)

app.get('/s', (re, res) => {
    return res.json("from backend.")
})

app.listen(8081, () => {
    console.log("listening")
})