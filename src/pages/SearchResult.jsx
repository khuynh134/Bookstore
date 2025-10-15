import axios from 'axios'
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResult.css'
import { DiVim } from 'react-icons/di';
import AuthorLinks from '../components/AuthorLinks';'../components/AuthorLinks';

const PORT = 8081 // port of the backend server

// render list of books in search result
function renderBooks(data){
    const elements = [];
    for (const book of data){
        // look for url of the Book Cover image
        let bookCoverURL = book.BookCoverURL;
        if (bookCoverURL == null || bookCoverURL.length == 0){
            bookCoverURL = "/book_covers/no_cover.png";
        }
        elements.push(
            <div key={book.BookID} className='book'>
                <img src={bookCoverURL}/>
                <div className='book-info'>
                    <div className='book-info-top'>
                        <h4>{book.Title}</h4>
                        <AuthorLinks authors={book.Authors}/>
                        <p>ID: {book.BookID}</p>
                        <p>ISBN: {book.ISBN}</p>
                    </div>
                    <div>
                        <p className='book-price'>${book.Price}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        );
    }           
    return <div className='search-result-container'>{elements}</div>;
}

export default function SearchResult(){
    const [result, setResult] = useState([])
    const [isLoading, setLoading] = useState(false)
    let keyword = useParams().keyword

    useEffect(() => {
        if(!keyword) return;

        setLoading(true)

        axios.get(`http://localhost:${PORT}/api/s`, {
            params:{
                keyword: keyword
            }
        })
        .then((response) => {
            setResult(response.data.result)
            console.log("response received")
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => setLoading(false))
    }, [keyword]);

    if(isLoading) {
        return (
            <div>
                <h2>Searching for "{keyword}"", please wait ...</h2>
            </div>
        );
    }
    if(result.length == 0){
        return (
            <div>
                <h2 className='result-title'>Search Result for "{keyword}"</h2>
                <div className='search-result-container'>
                    <h2>No result found</h2>
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className='result-title'>Search Result for "{keyword}"</h2>
            {renderBooks(result)}
        </div>
    );
}