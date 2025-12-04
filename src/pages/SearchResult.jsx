import axios from 'axios'
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SearchResult.css'
import { DiVim } from 'react-icons/di';
import BookWithAddToCart from '../components/BookWithAddToCart';
import Pagination from '../components/Pagination';
const PORT = 8081 // port of the backend server

// compose the address to get backend data
function getBackendAdr(){
    return `http://localhost:${PORT}/s`;
}

// render list of books in search result
function renderBooks(data){
    const elements = [];
    for (const book of data){
        elements.push(
            <BookWithAddToCart key={book.BookID} book={book}/>
        );
    }           
    return <div className='search-result-books'>{elements}</div>;
}

export default function SearchResult(){
    const [result, setResult] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const pageSize = 12; // # of books per page
    let keyword = useParams().keyword; // what to search for
    let page = useParams().page; // current page number

    // when either keyword change or page change
    useEffect(() => {
        if(!keyword) return;
        if (page == null || isNaN(page)){
            page = 1;
        }else{
            page = parseInt(page);
        }

        window.scrollTo(0,0);
        setLoading(true);

        axios.get(getBackendAdr(), {
            params:{
                keyword: keyword,
                page: page,
                pageSize: pageSize
            }
        })
        .then((response) => {
            setResult(response.data.books);
            setHasNext(response.data.hasNext);
            console.log("search result received");
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }, [keyword, page]);

    if(isLoading) {
        if(page != 1){
            return (
                <div className='loading'>
                    <h2>Searching for "{keyword}"", please wait ...</h2>
                </div>
            );
        }
        return (
            <div className='loading'>
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
        );
    }
    
    return (
        <div>
            <h2 className='result-title'>Search Result for "{keyword}"</h2>
            <Pagination page={page} url={`/s/${encodeURIComponent(keyword)}/`} hasNext={hasNext}></Pagination>
            {renderBooks(result)}
            <Pagination page={page} url={`/s/${encodeURIComponent(keyword)}/`} hasNext={hasNext}></Pagination>
        </div>
    );
}