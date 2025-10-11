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
                <h2>Searching for "{keyword}"", please wait ...</h2>
            </div>
        );
    }
    if(result.length == 0){
        return (
            <div className='search-result-container'>
                <h2 className='result-title'>Search Result for "{keyword}"</h2>
                <h2 className='result-title'>No result found</h2>
            </div>
        )
    }
    return (
        <div className='search-result-container'>
            <h2 className='result-title'>Search Result for "{keyword}"</h2>
            <table className='result-table'>
                <tr>
                    <th className='table-header'>BookID</th>
                    <th className='table-header'>Title</th>
                    <th className='table-header'>ISBN</th>
                    <th className='table-header'>Price</th>
                </tr>
                {result.map(book => {
                    return (
                        <tr className='book-row'>
                            <th className='table-data'>{book.BookID}</th>
                            <th className='table-data'>{book.Title}</th>
                            <th className='table-data'>{book.ISBN}</th>
                            <th className='table-data'>${book.Price}</th>
                        </tr>
                    )
                })}
                </table>
        </div>
    );
}