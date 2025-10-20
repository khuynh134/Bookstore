import AuthorLinks from "./AuthorLinks";
import './BookWithAddToCart.css';

export default function BookWithAddToCart({book}){
    // look for url of the Book Cover image
    let bookCoverURL = book.BookCoverURL;
    if (bookCoverURL == null || bookCoverURL.length == 0){
        bookCoverURL = "/book_covers/No Book Cover.jpg";
    }
    return (
        <div key={book.BookID} className='book'>
            <img src={bookCoverURL}/>
            <div className='book-info'>
                <div className='book-info-top'>
                    <h4>{book.Title}</h4>
                    <AuthorLinks authorNames={book.AuthorName} authorIDs={book.AuthorID}/>
                    <p>ID: {book.BookID}</p>
                    <p>ISBN: {book.ISBN}</p>
                </div>
                <div className='book-info-bottom'>
                    <p className='book-price'><b>${book.Price}</b></p>
                    <button>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}