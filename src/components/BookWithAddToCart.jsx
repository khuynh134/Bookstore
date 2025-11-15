import AuthorLinks from "./AuthorLinks";
import './BookWithAddToCart.css';
import { useNavigate } from 'react-router-dom';

export default function BookWithAddToCart({book}){
    const navigate = useNavigate();

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

    const handleAddToCart = async () => {
        // Make sure user is logged in
        const token = localStorage.getItem('token');
        if(!token){
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }

        // The User is logged in, proceed to add the book to cart via API
        try {
            const response = await fetch('http://localhost:8081/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    book_id: book.BookID,
                    quantity: 1,
                    unit_price_cents: Math.round(book.Price * 100)
                })
            });
           
            if (response.ok) {
                // Successfully added to cart - show confirmation & navigate to cart 
                alert(`Added "${book.Title}" to cart.`);
                navigate('/cart');

            } else if (response.status === 401){
                // invalid or expired token = navigate to login
                alert('Your session has expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add item to cart.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding the item to cart. Please try again later.');
        }
    };
    
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
                    <button
                    onClick={handleAddToCart}
                    disabled={book.Stock == null || book.Stock === 0}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}