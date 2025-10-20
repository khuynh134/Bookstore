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
            bookCoverURL = "/book_covers/No Book Cover.jpg";
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
                    <div className='book-info-bottom'>
                        <p className='book-price'>${book.Price}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        );
    }           
    return <div className='search-result-books'>{elements}</div>;
}

export default function SearchResult(){
    const [result, setResult] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const pageSize = 12 // # of books per page
    let keyword = useParams().keyword // what to search for

    // when searching keywork change, reset the page number to default
    useEffect(() => {
        setPage(1);
    },[keyword])

    // when either keyword change or page change
    useEffect(() => {
        if(!keyword) return;

        window.scrollTo(0,0);
        setLoading(true)

        axios.get(`http://localhost:${PORT}/api/s`, {
            params:{
                keyword: keyword,
                page: page,
                pageSize: pageSize
            }
        })
        .then((response) => {
            setResult(response.data.result)
            setHasNext(response.data.hasNext)
            console.log("response received")
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => setLoading(false))
    }, [keyword, page]);

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
            <div className='pagination'>
                {(page != 1) ? <button className="prev-btn" onClick={()=>{setPage(page - 1)}}>Prev</button> 
                : <div></div>}
                <span className="page-number">page <strong>{page}</strong></span>
                {hasNext? <button className="next-btn" onClick={()=>{setPage(page + 1)}}>Next</button>
                : <div></div>}
            </div>

            {renderBooks(result)}

            <div className='pagination'>
                {(page != 1) ? <button className="prev-btn" onClick={()=>{setPage(page - 1)}}>Prev</button> 
                : <div></div>}
                <span className="page-number">page <strong>{page}</strong></span>
                {hasNext? <button className="next-btn" onClick={()=>{setPage(page + 1)}}>Next</button>
                : <div></div>}
            </div>
        </div>
    );
}