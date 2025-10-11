import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResult.css'

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
                <h2>Searching for {keyword}, please wait ...</h2>
            </div>
        );
    }
    if(result.length == 0){
        return (
            <div>
                <h2>Search Result for {keyword}</h2>
                <h2>No result found</h2>
            </div>
        )
    }
    return (
        <div className='search-result-page'>
            <h2 className="search-title">Search Result for {keyword}</h2>
            <table>
                <tr>
                    <th className="result-table-title">BookID</th>
                    <th className="result-table-title">Title</th>
                    <th className="result-table-title">ISBN</th>
                    <th className="result-table-title">Price</th>
                </tr>
                {result.map(book => {
                    return (
                        
                        <tr>
                            <th className="result-id">{book.BookID}</th>
                            <th className="result-book-info">{book.Title}</th>
                            <th className="result-book-info">{book.ISBN}</th>
                            <th className="result-book-info">{book.Price}</th>
                        </tr>
                        
                    )

                })}
                </table>
        </div>
    );
}