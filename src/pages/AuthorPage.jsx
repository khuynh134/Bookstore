import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './AuthorPage.css';
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

function renderBackButton(){
    const navigate = useNavigate();
    return (
        <button onClick={()=>{navigate(-1)}}>
            {"<"} Back
        </button>
    );
}

export default function AuthorPage(){
    const [bookList, setBookList] = useState([]);
    const [authorName, setAuthorName] = useState("");

    let authorID = useParams().authorID;
    console.log("author page for author id ", authorID)

    useEffect(() => {
        window.scrollTo(0,0);

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
                {renderBackButton()}
                <h2>
                    No Such Author...
                </h2>
            </div>
        )
    }

    return (
        <div className="author-page">
            {renderBackButton()}
            <h1 className="author-title">
                {authorName}
            </h1>
            <div className="author-book-list">
                {bookList.map(renderBook)}
            </div>
        </div>
    )
}