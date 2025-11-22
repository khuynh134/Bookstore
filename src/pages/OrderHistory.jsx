// src/pages/OrderHistory.jsx (or wherever you keep it)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          setError("You must be logged in to view your orders.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8081/api/orders/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Orders response status:", res.status);
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <section id="order-history" className="section-p1">
        <p>Loading your orders...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="order-history" className="section-p1">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section id="order-history" className="section-p1">
      <h1>Order History</h1>

      <table width="100%">
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Order Number</th>
            <th>Quantity</th> 
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                You don’t have any orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : ""}
                </td>
                <td>{order.order_id}</td>
                <td>{order.total_quantity}</td>
                <td>
                  {typeof order.total_cents === "number"
                    ? `$${(order.total_cents / 100).toFixed(2)}`
                    : ""}
                </td>
                <td>{order.status}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => handleViewDetails(order.order_id)}
                  > View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default OrderHistory;
