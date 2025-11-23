import "./Cart.css";
import "@fortawesome/fontawesome-free";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const API_BASE = "http://localhost:8081";
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  //helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login');
      return null;
    }
    return{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  //Check if user is logged in, redifrext if not logged in
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if(!token){
      alert('Please log in to view your cart.');
      navigate('/login');
      return false;
    }
    return true;
  };
  
  // helper function to check the stock of the book
  async function checkStock(bookID) {
    try {
      const res = await fetch(`${API_BASE}/stock?bookID=${bookID}`);
      return (await res.json()).stock;
    } catch (e) {
      console.error("Stock fetch error:", e);
      return 0;
    }
  }


  async function loadCart() {
    if(!checkAuth()) return;
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if(!headers) return;

      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'GET',
        headers: headers,
        credentials: "include",
      });

      if(res.status === 401 || res.status === 403){
        alert('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error("loadCart error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadCartQuiet() {
  try {
    const headers = getAuthHeaders();
    if(!headers) return;
    
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: 'GET',
      headers: headers,
      credentials: "include",
    });
    const data = await res.json();
    if (Array.isArray(data.items)) setItems(data.items);
  } catch (e) {
    console.error("quiet reload failed:", e);
  }
}


  useEffect(() => {
    loadCart();
  }, []);

  async function removeItem(itemId) {
  const prev = items;
  setItems(cur => cur.filter(x => x.item_id !== itemId));

  try {
    const headers = getAuthHeaders();
    if(!headers) {
      setItems(prev);
      return;
    }
    const res = await fetch(
      `${API_BASE}/api/cart/items/${itemId}`,
      { method: "DELETE", headers: headers, credentials: "include" }
    );

    if (!res.ok) {
      setItems(prev);
      const t = await res.text();
      console.error("Delete failed:", t);
      alert("Could not remove item.");
      return;
    }

    //  refreshes quietly in background so it does not glitch
    loadCartQuiet();
  } catch (e) {
    setItems(prev);
    console.error("Delete error:", e);
    alert("Network error removing item.");
  }
}


  //refresh items from server response
  async function setItemQuantity(itemId, newQty) {
    const qty = Math.max(1, Number(newQty) || 1);
    try {
      const headers = getAuthHeaders();
      if(!headers) return;

      const res = await fetch(
        `${API_BASE}/api/cart/items/${itemId}`,
        {
          method: "PATCH",
          headers: headers,
          credentials: "include",
          body: JSON.stringify({ quantity: qty }),
        }
      );
      let payload = null;
      try { payload = await res.json(); } catch {}
      if (!res.ok) {
        console.error("PATCH failed", res.status, payload);
        alert(payload?.error || "Could not update quantity.");
        return;
      }
      setItems(payload.items || []);
    } catch (e) {
      console.error("PATCH error:", e);
      alert("Network error updating quantity.");
    }
  }

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.unit_price) * Number(it.quantity),
    0
  );

  if (loading) return <div>Loading your cart…</div>;

  return (
    <div>
      <h1>Your Cart</h1>

      <section id="cart" className="section-p1">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Your cart is empty.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.item_id}>
                  <td>
                    <i
                      className="far fa-times-circle"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeItem(it.item_id)}
                      title="Remove"
                    />
                  </td>
                  <td>
                    <img
                      src={it.BookCoverURL || "https://via.placeholder.com/60x80"}
                      alt={it.Title}
                    />
                  </td>
                  <td>{it.Title}</td>
                  <td>${Number(it.unit_price).toFixed(2)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        className="qty-btn"
                        onClick={() => setItemQuantity(it.item_id, it.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode ="numeric"
                        pattern="[0-9]*"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => {
                          setItemQuantity(it.item_id, e.target.value);
                        }}
                        onBlur={(e) => {
                          setItemQuantity(it.item_id, e.target.value);
                        }}
                        style={{ width: 56, textAlign: "center" }}
                      />
                      <button
                        className="qty-btn"
                        onClick={() => setItemQuantity(it.item_id, it.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section id="cart-add" className="section-p2">
        <div id="subtotal">
          <h1>Cart Total</h1>
          <table>
            <tbody>
              <tr>
                <td>Cart Subtotal:</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>${subtotal.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          <button className="button" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </section>
    </div>
  );
}

export default Cart;
