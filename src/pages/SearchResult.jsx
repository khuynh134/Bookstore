import axios from 'axios'
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResult.css'
import { DiVim } from 'react-icons/di';

const PORT = 8081 // port of the backend server

function renderAuthors(authors){
    const element = [];
    if(authors != null && authors.length != 0){
        element.push("Author: ");
        for (let i = 0; i < authors.length; i++){
            element.push(
                <Link key={authors[i].AuthorID} to={`/author/${authors[i].AuthorID}`}>
                    {authors[i].AuthorName}
                </Link>
            );
            // the commas and space between multiple authors
            if(i != authors.length - 1) {
                element.push(", ");
            }
        }
    }
    return <p>{element}</p>;
}

// render list of books in search result
function renderBook(data){
    const elements = [];
    for (const book of data){
        // look for url of the Book Cover image
        let cover_url = book.BookCoverURL;
        if (cover_url == null){
            cover_url = "/book_covers/no_cover.png";
        }
        elements.push(
            <div className='book'>
                <img src={cover_url}/>
                <div className='book-info'>
                    <div className='book-info-top'>
                        <h4>{book.Title}</h4>
                        <p>{renderAuthors(book.Authors)}</p>
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
            setAuthors(response.data.authors)
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
            {renderBook(result)}
        </div>
    );
}