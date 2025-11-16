import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './AuthorPage.css';
import BookWithAddToCart from '../components/BookWithAddToCart';
import BackButton from '../components/BackButton';

const PORT = 8081;
// compose and return the backend server address to get the data.
function getBackendAdr(){
    return `http://localhost:${PORT}/s/author`;
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
                <BackButton />
                <h2>
                    No Such Author...
                </h2>
            </div>
        )
    }

    return (
        <div>
            <BackButton />
            <div className="author-page">
                <h1 className="author-title">
                    {authorName}
                </h1>
                <div className="author-book-list">
                    {bookList.map(book=>{
                        return <BookWithAddToCart key={book.BookID} book={book}/>
                    })}
                </div>
            </div>
        </div>
    )
}