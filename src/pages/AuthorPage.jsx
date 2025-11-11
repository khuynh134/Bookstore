import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './AuthorPage.css';
import BookWithAddToCart from '../components/BookWithAddToCart';

const PORT = 8081;
// compose and return the backend server address to get the data.
function getBackendAdr(){
    return `http://localhost:${PORT}/s/author`;
}

// render the button to go back to last page
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

    useEffect(() => {
        if(!authorID) return;
        console.log("author page for author id ", authorID)

        window.scrollTo(0,0);

        axios.get(getBackendAdr(), {
                params:{
                    authorID: authorID
                }
            })
            .then((response) => {
                setAuthorName(response.data.authorName)
                setBookList(response.data.books)
                console.log(`  Received ${response.data.books.length} books for author ${response.data.authorName}`)
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
                {bookList.map(book=>{
                    return <BookWithAddToCart key={book.BookID} book={book}/>
                })}
            </div>
        </div>
    )
}