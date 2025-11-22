import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load order");

        const data = await res.json();
        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        console.error(err);
        setError("Could not load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="order-details">
      

      <h1>Order #{order.order_id}</h1>
      <p>Placed on {new Date(order.created_at).toLocaleString()}</p>
      <p>Status: <strong>{order.status}</strong></p>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Book</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.book_id}>
              <td>
                <img src={item.BookCoverURL} alt={item.Title} width="60" />
              </td>
              <td>{item.Title}</td>
              <td>{item.quantity}</td>
              <td>${(item.unit_price_cents / 100).toFixed(2)}</td>
              <td>
                ${(item.quantity * (item.unit_price_cents / 100)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ textAlign: "right" }}>
        Order Total: ${(order.total_cents / 100).toFixed(2)}
      </h2>
    </section>
  );
}

export default OrderDetails;
