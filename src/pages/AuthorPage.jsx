import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './AuthorPage.css';
import AuthorLinks from '../components/AuthorLinks';
const PORT = 8081;

function renderBook(bookData){
    console.log(` rendering book with id = ${bookData.BookID}`)
    let url = bookData.BookCoverURL;
    if(! url || url.length == 0){
        url = "/book_covers/no_cover.png";
    }
    return (
        <div className="book">
            <img src = {url}/>
            <div className="book-info">
                <h4>{bookData.Title}</h4>
                <p>{bookData.ISBN}</p>
                <p><b>${bookData.Price}</b></p>
                <button>Add to Cart</button>
            </div>
        </div>
    )
}

export default function AuthorPage(){
    const [bookList, setBookList] = useState([]);
    const [authorName, setAuthorName] = useState("");

    let authorID = useParams().authorID;
    console.log("author page for author id ", authorID)
    useEffect(() => {
        axios.get(`http://localhost:${PORT}/author`, {
                params:{
                    authorID: authorID
                }
            })
            .then((response) => {
                setAuthorName(response.data.authorName)
                setBookList(response.data.books)
                console.log(`response about author ${authorName} received, ${bookList.length} books.`)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [authorID])
    
    if (authorName == null || authorName.length == 0){
        return (
            <div>
                <h2>
                    No Such Author...
                </h2>
            </div>
        )
    }

    return (
        <div className="author-page">
            <h1 className="author-title">
                {authorName}
            </h1>
            <div className="author-book-list">
                {bookList.map(renderBook)}
            </div>
        </div>
    )
}