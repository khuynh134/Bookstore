import { useNavigate } from 'react-router-dom';

/*Customized Add to Cart button component
book is the data of the book to add
text is the text to display on the button (default "Add to Cart")
other props are passed to the button element
*/

export default function AddToCartButton({book, text, ...props}){
    const navigate = useNavigate();
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
        <button onClick={handleAddToCart} {...props}>
            {text || "Add to Cart"}
        </button>
    );
}