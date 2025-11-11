import AuthorLinks from "./AuthorLinks";
import './BookWithAddToCart.css';

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

    // process book category strings
    let categories =  (book.Category)? book.Category : "";
    categories = categories.replace(/[\[\]\']/g, '');
    if(categories.length > 100){
        categories = categories.substr(0, 100) + "..."
    }
    
    return (
        <div key={book.BookID} className='book'>
            <img src={bookCoverURL}/>
            <div className='book-info'>
                <div className='book-info-top'>
                    <h4>{book.Title}</h4>
                    <AuthorLinks authorNames={book.AuthorName} authorIDs={book.AuthorID}/>
                    <p>Genre: {categories}</p>
                    <p>ID: {book.BookID}</p>
                    <p>ISBN: {book.ISBN}</p>
                </div>
                <div className='book-info-bottom'>
                    {stock_msg.length > 0 && <p className="stock">{stock_msg}</p> }
                    <p className='book-price'><b>${book.Price}</b></p>
                    <button>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}