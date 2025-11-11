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
    const [books, setBooks] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const pageSize = 24 // # of books per page
    let category = useParams().category // what to search for

    // when category change, reset the page number to default
    useEffect(() => {
        setPage(1);
    },[category])

    // when either keyword change or page change
    useEffect(() => {
        if(!category) return;

        window.scrollTo(0,0);
        setLoading(true)

        axios.get(getBackendAdr(), {
            params:{
                category: category,
                page: page,
                pageSize: pageSize
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
            <Pagination page={page} setPage={setPage} hasNext={hasNext}/>
            <div className='category-booklist'>
                {books.map((book)=>{
                    return <BookWithAddToCart book={book}/>;
                })}
            </div>
            <Pagination page={page} setPage={setPage} hasNext={hasNext}/>
        </div>
    );
}