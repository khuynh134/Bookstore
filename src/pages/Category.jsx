import axios from 'axios'
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Category.css'
import BookWithAddToCart from '../components/BookWithAddToCart';
import Pagination from '../components/Pagination';
const PORT = 8081 // port of the backend server

// compose the address to get backend data
function getBackendAdr(){
    return `http://localhost:${PORT}/s/category`;
}

export default function BooksOfCategory(){
    const [books, setBooks] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const PAGE_SIZE = 12; // # of books per page
    let category = useParams().category; // what to search for
    let page = useParams().page; // current page number

    // when either keyword change or page change
    useEffect(() => {
        if(!category) return;
        if(!page || isNaN(page)){
            page = 1;
        }else{
            page = parseInt(page);
        }

        window.scrollTo(0,0);
        setLoading(true);

        axios.get(getBackendAdr(), {
            params:{
                category: category,
                page: page,
                pageSize: PAGE_SIZE
            }
        })
        .then((response) => {
            setBooks(response.data.books)
            setHasNext(response.data.hasNext)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => setLoading(false))
    }, [category, page]);

    if(isLoading) {
        return (
            <div className='loading'>
                <h2>Loading, please wait ...</h2>
            </div>
        )
    }

    if(books.length == 0){
        return (
            <div>
                <h2 className='title'>No such category "{category}"</h2>
            </div>
        )
    }
    return (
        <div>
            <h1 className='category-title'>{category}</h1>
            <Pagination page={page} url={`/category/${encodeURIComponent(category)}/`} hasNext={hasNext}/>
            <div className='category-booklist'>
                {books.map((book)=>{
                    return <BookWithAddToCart book={book}/>;
                })}
            </div>
            <Pagination page={page} url={`/category/${encodeURIComponent(category)}/`} hasNext={hasNext}/>
        </div>
    );
}