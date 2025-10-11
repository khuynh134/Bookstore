import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResult.css'
import { DiVim } from 'react-icons/di';

const PORT = 8081 // port of the backend server

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
            <div className='search-result-container'>
                {result.map(book => {
                    let cover_url = book.BookCoverURL;
                    if (cover_url == null){
                        cover_url = "/book_covers/no_cover.png"
                    }
                    return (
                        <div className='book'>
                            <img src={cover_url}/>
                            <div className='book-info'>
                                <div className='book-info-top'>
                                    <h4 className='book-title'>{book.Title}</h4>
                                    <p className='book-title'>ID: {book.BookID}</p>
                                    <p className='book-title'>ISBN: {book.ISBN}</p>
                                </div>
                                <div>
                                    <p className='book-price'>${book.Price}</p>
                                    <button>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
            </div>
        </div>
    );
}