import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './BookDetail.css';
import AuthorLinks from '../components/AuthorLinks';
import BackButton from '../components/BackButton';

const PORT = 8081;
// compose and return the backend server address to get the data.
function getBackendAdr(){
    return `http://localhost:${PORT}/s/book`;
}

export default function BookDetail(){
    const [detail, setDetail] = useState({});

    const bookID = useParams().bookID;

    useEffect(() => {
        if(!bookID) return;
        console.log("Book details for bookID", bookID)

        window.scrollTo(0,0);

        axios.get(getBackendAdr(), {
                params:{
                    bookID: bookID
                }
            })
            .then((response) => {
                setDetail(response.data.detail)
                console.log(`  Received book ${response.data.detail.Title}`)
                if(!detail){
                    alert("No book found.");
                    return;
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [bookID])

    return(
        <div>
            <BackButton />
            <div className="book-detail-page">
                <div className="book-detail-left">
                    <img src={detail.BookCoverURL} alt={`Cover of ${detail.Title}`} />
                </div>
                <div className="book-detail-right">
                    <h1>{detail.Title}</h1>
                    <AuthorLinks authorIDs={detail.AuthorID} authorNames={detail.AuthorName}/>
                    <p><b>ISBN:</b> {detail.ISBN}</p>
                    <p><b>ID:</b> {detail.BookID}</p>
                    <p><b>Description:</b> {detail.Description}</p>
                    <div className='divider' />
                    <p className="book-price"><strong>${detail.Price}</strong></p>
                </div>
            </div>
        </div>
    );
};