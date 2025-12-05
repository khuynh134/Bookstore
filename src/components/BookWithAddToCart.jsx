import AuthorLinks from "./AuthorLinks";
import './BookWithAddToCart.css';
import { Link } from 'react-router-dom';
import AddToCartButton from "./AddToCartButton";

export default function BookWithAddToCart({book}){
    // look for url of the Book Cover image
    let bookCoverURL = book.BookCoverURL;
    if (bookCoverURL == null || bookCoverURL.length == 0){
        bookCoverURL = "/book_covers/No Book Cover.jpg";
    }
    
    // Message if the stock is low or unavailable
    let stock_msg = "";
    if (book.Stock == null || book.Stock == 0){
        stock_msg = "Currently Unavailable";
    }else if (book.Stock <= 5){
        stock_msg = `${book.Stock} Left`;
    }

    // Disable "Add to Cart" button if out of stock
    const isNotInStock = book.Stock == null || book.Stock === 0;

    // process book category strings
    let categories =  (book.Category)? book.Category : "";
    categories = categories.replace(/[\[\]\']/g, '');
    if(categories.length > 100){
        categories = categories.substr(0, 100) + "...";
    }
    
    return (
        <div key={book.BookID} className='book'>
            <div className="book-cover">
                <Link  to={`/book/${book.BookID}`}>
                    <img src={bookCoverURL} alt={`Cover of ${book.Title}`} />
                </Link>
            </div>
            <div className='book-info'>
                <div className='book-info-top'>
                    <Link className="book-detail-link" to={`/book/${book.BookID}`}>
                        <h4>{book.Title}</h4>
                    </Link>
                    <AuthorLinks authorNames={book.AuthorName} authorIDs={book.AuthorID}/>
                    <p><b>Genre:</b> {categories}</p>
                    <p><b>ID:</b> {book.BookID}</p>
                    <p><b>ISBN:</b> {book.ISBN}</p>
                </div>
                <div className='book-info-bottom'>
                    {stock_msg.length > 0 && <p className="stock">{stock_msg}</p> }
                    <p className='book-price'><b>${book.Price}</b></p>
                    <AddToCartButton className="add-to-cart-button" book={book} disabled={isNotInStock} />
                </div>
            </div>
        </div>
    );
}