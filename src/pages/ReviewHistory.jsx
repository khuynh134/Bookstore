import { useEffect, useState } from "react";
import axios from "axios";
import './ReviewHistory.css';


const PORT = 8081;

export default function ReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        const resp = await axios.get(
          `http://localhost:${PORT}/api/reviews/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReviews(resp.data || []);
      } catch (err) {
        setError("Failed to load your review history.");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    
    <div style={{ padding: "20px" }}>
     
      <h1 className= "review-title">My Review History </h1>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && reviews.length === 0 && <p>You have not written any reviews yet.</p>}

      {reviews.map((r) => (
        <div key={r.id} className="review-card">
          <h3>
            {r.book_title}
                <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#2f4797ff" }}>
                {" — "}{r.author_name}
                 </span>
        </h3>
          <p>
            <strong>Rating:</strong> {r.rating} / 5</p>
          <p>{r.comment || "(No comment)"}</p>
          <p className="review-date">
            {new Date(r.created_at).toLocaleString()}
          </p>
          
        </div>
      ))}
    </div>
    
  );
}
