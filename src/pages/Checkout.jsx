import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Checkout() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState({
        fullName: '', 
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [payment, setPayment] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [orderConfirmation, setOrderConfirmation] = useState(null);


   // Load cart items from backend API
   useEffect(() => {
        const loadCartItems = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            if(!token){
                 setError('Please log in to view your cart.');
                 navigate('/login');
                 setLoading(false);
                 return;
            }

            try{
                const res = await fetch('http://localhost:8081/api/cart', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                if(!res.ok){
                    if(res.status === 401){
                        setError('Session expired - please log in again.');
                        localStorage.removeItem("token");
                        navigate('/login');
                        return;
                    }
                    throw new Error(await res.text());
                }
                const data = await res.json();
                setItems(Array.isArray(data.items) ? data.items : []);  
            } catch (err){
                console.error('Error loading cart items:', err);
                setError('Failed to load cart items. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        loadCartItems();
   }, [navigate])

    const calculateTotal = () => {
         const total = items.reduce((total, item) => {
            const unit = Number(item.price ?? item.unit_price ?? (item.unit_price_cents ? item.unit_price_cents / 100 : 0)) || 0;
            const qty = Number(item.quantity || 0) || 0;
            return total + unit * qty;
        }, 0);
        return Number(total).toFixed(2);
    };

    const handlePlaceOrder = async (e) => {
        e?.preventDefault?.();
        setPlacing(true);
        setError(null);
        //validate inputs of information 
        if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
            setError('Please fill in all required address fields.');
            setPlacing(false);
            return;
        }

        const payloadItems = items.map(it => ({
            book_id: it.book_id ?? it.BookID ?? it.bookId,
            quantity: Number(it.quantity || 1),
            unit_price_cents: it.unit_price_cents ?? Math.round((it.unit_price ?? 0 ) * 100)
        }));

        const payload = {
            items: payloadItems,
            shipping_address: address, 
            payment_info: {
                cardName: payment.cardName,
                last4: payment.cardNumber ? String(payment.cardNumber).slice(-4) : null,
                expiry: payment.expiry
            },
            shipping_cents: 0,
            tax_cents: 0
        };

        try {
              console.debug('Placing order payload:', payload);
              const token = localStorage.getItem("token");
              if (!token) {
                                setError('Please log in to place an order.');
                                navigate('/login');
                                setPlacing(false);
                                return;
                }

            const res = await fetch('http://localhost:8081/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.message || 'Failed to place order.');
            }

            // success
            const data = await res.json();
            setOrderConfirmation({ order: data.order, items: data.items });
            setItems([]);
            setPlacing(false);
            alert('Order placed successfully!');
            // navigate after successful order creation
            navigate('/');
        } catch (err){
            console.error('Error placing order:', err);
            // show full error message (includes status if available)
            setError(err.message || 'Failed to place order. Please try again later.');
            setPlacing(false);
        }

    };

    if (loading) return <div> Loading cart...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="checkout">
            <h2 className="checkout-h2">Checkout</h2>
            {/* Address and Payment Info */}
            <div className="checkout-address-payment">
                <h3 className="checkout-info">Shipping Address</h3>
                <form className="address-form">
                    <input className = "address-input" type = "text" placeholder = "Full Name *" required
                        value = {address.fullName}
                        onChange = { (e) => setAddress(prev => ({...prev, fullName: e.target.value})) }
                    />
                    <input className = "address-input" type = "text" placeholder = "Address Line 1 *" required
                        value = {address.addressLine1}
                        onChange = { (e) => setAddress (prev => ({...prev, addressLine1: e.target.value})) }
                    />
                    <input className = "address-input" type = "text" placeholder = "Address Line 2"
                        value ={address.addressLine2}
                        onChange ={(e) => setAddress(prev => ({...prev, addressLine2: e.target.value}))}
                    />
                    <input className = "address-input" type = "text" placeholder = "City *" required
                        value ={address.city}
                        onChange ={(e) => setAddress(prev => ({...prev, city: e.target.value}))}
                    />
                    <input className = "address-input" type = "text" placeholder = "State/Province *" required
                        value ={address.state}
                        onChange ={(e) => setAddress(prev => ({...prev, state: e.target.value}))}
                    />
                    <input className = "address-input" type = "text" placeholder = "ZIP/Postal Code *" required
                        value ={address.postalCode}
                        onChange ={(e) => setAddress(prev => ({...prev, postalCode: e.target.value}))}
                    />
                    <input className = "address-input" type = "text" placeholder = "Country *" required
                        value ={address.country}
                        onChange ={(e) => setAddress(prev => ({...prev, country: e.target.value}))}
                    />
                </form>
                <h3 className="checkout-info">Payment Information</h3>
                <form className="payment-form">
                    <input className="payment-input" type="text" placeholder="Cardholder Name *" required
                        value={payment.cardName}
                        onChange={(e) => setPayment(prev => ({...prev, cardName: e.target.value}))}
                    />
                    <input className="payment-input" type="text" placeholder="Card Number *" required
                        value={payment.cardNumber}
                        onChange={(e) => setPayment(prev => ({...prev, cardNumber: e.target.value}))}
                    />
                    <input className="payment-input" type="text" placeholder="Expiration Date (MM/YY) *" required
                        value={payment.expiry}
                        onChange={(e) => setPayment(prev => ({...prev, expiry: e.target.value}))}
                    />
                    <input className="payment-input" type="text" placeholder="CVV *" required
                        value={payment.cvv}
                        onChange={(e) => setPayment(prev => ({...prev, cvv: e.target.value}))}
                    />
                </form>
            </div>
            {/*Checkout Items*/}
            <div className="checkout-items">
                <h3 className="checkout-info">Order Summary</h3>
                {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => {
                        const unit = Number(item.price ?? item.unit_price ?? (item.unit_price_cents ? item.unit_price_cents / 100 : 0)) || 0;
                        const qty = Number(item.quantity || 0) || 0;
                        return (
                            <div key={item.id ?? item.item_id ?? `${item.book_id}-${item.bookId}`} className="checkout-item">
                                <span> {item.Title || item.title || `Book ${item.book_id}`}</span>
                                <span>Quantity: {qty}</span>
                                <span>Price: ${(unit * qty).toFixed(2)}</span>
                            </div>
                        );
                    })
                ) : (
                    <p> Your cart is empty. </p>
                )}
            </div>
            <div className="checkout-summary">
                <h3 className="calculate-total">Total: ${calculateTotal()}</h3>
                <button className="place-order-button" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? 'Placing...' : 'Place Order'}
                </button>
            </div>
        </div>
    );


}
export default Checkout;