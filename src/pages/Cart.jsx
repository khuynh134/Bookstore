import "./Cart.css";
import "@fortawesome/fontawesome-free";
import React, { useEffect, useState } from "react";

function Cart() {
  const API_BASE = "http://localhost:8081";
  const CART_ID = 1; // this is for testing purposes but must be changed to dynamic

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cart?cart_id=${CART_ID}`, {
        credentials: "include",
      });
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
    const res = await fetch(`${API_BASE}/api/cart?cart_id=${CART_ID}`, {
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
    const res = await fetch(
      `${API_BASE}/api/cart/items/${itemId}?cart_id=${CART_ID}`,
      { method: "DELETE", credentials: "include" }
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
      const res = await fetch(
        `${API_BASE}/api/cart/items/${itemId}?cart_id=${CART_ID}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
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
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => {
                          const v = e.target.value;
                          // update on blur/enter to avoid spamming server while typing
                          e.target.onblur = () => setItemQuantity(it.item_id, v);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
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
          <button className="buttn">Proceed to Checkout</button>
        </div>
      </section>
    </div>
  );
}

export default Cart;
