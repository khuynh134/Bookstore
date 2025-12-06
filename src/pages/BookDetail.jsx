import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './BookDetail.css';
import AuthorLinks from '../components/AuthorLinks';
import BackButton from '../components/BackButton';
import AddToCartButton from '../components/AddToCartButton';

const PORT = 8081;
// compose and return the backend server address to get the data.
function getBackendAdr(){
    return `http://localhost:${PORT}/s/book`;
}

export default function BookDetail(){
    const [detail, setDetail] = useState({});

    const bookID = useParams().bookID;

    const [rating, setRating] = useState(0);
    const totalRatings = 5;
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);


    const Star = ({ filled, onClick }) => (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        fontSize: "28px",
        color: filled ? "#ffc107" : "#ccc",
        transition: "0.2s"
      }}
    >
      ★
    </span>
  );

    useEffect(() => {
        if(!bookID) return;
        console.log("Book details for bookID", bookID)

        window.scrollTo(0,0);

        axios.get(getBackendAdr(), {
                params:{
                    bookID: bookID
                }
            })
            .then((response) => {
                setDetail(response.data.detail)
                console.log(`  Received book ${response.data.detail.Title}`)
                if(!detail){
                    alert("No book found.");
                    return;
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [bookID]);

    useEffect(() => {
          if (!bookID) return;

      const fetchReviews = async () => {
         setReviewsLoading(true);
         setReviewsError(null);

      try {
      const resp = await axios.get(
        `http://localhost:${PORT}/api/reviews/book/${bookID}`
      );
      setReviews(resp.data.reviews || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setReviewsError('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
    };

    fetchReviews();
   }, [bookID]);

async function handleSubmitReview() {
  if (!rating) {
    alert('Please select a rating between 1 and 5.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to submit a review.');
    return;
  }

  try {
    setSubmittingReview(true);

    const resp = await axios.post(
      `http://localhost:${PORT}/api/reviews/book/${bookID}`,
      { rating, comment: reviewText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Review submitted!');

    // add the new review to the top of the list
    if (resp.data && resp.data.review) {
      setReviews((prev) => [resp.data.review, ...prev]);
    }

    setRating(0);
    setReviewText('');
  } catch (err) {
    console.error('Error submitting review:', err);
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Failed to submit review.';
    alert(msg);
  } finally {
    setSubmittingReview(false);
  }
}

     
    return(
        <div>
            
            <div className="book-detail-page">
                <div className="book-detail-left">
                    <img src={detail.BookCoverURL} alt={`Cover of ${detail.Title}`} />
                </div>
                <div className="book-detail-right">
                    <h1>{detail.Title}</h1>
                    <AuthorLinks authorIDs={detail.AuthorID} authorNames={detail.AuthorName}/>
                    <p><b>Genre:</b> {detail.Category}</p>
                    <p><b>ISBN:</b> {detail.ISBN}</p>
                    <p><b>ID:</b> {detail.BookID}</p>
                    <p><b>Description:</b> {detail.Description}</p>
                    <div className='divider' />
                    <p> current inventory: {detail.Stock}</p>
                    <p className="book-price"><strong>${detail.Price}</strong></p>
                    <AddToCartButton className="add-to-cart-button" book={detail} />
                </div>
            </div>

            <div className="rate-book-section">
             <h2 className="rate-book-title">Rate This Book</h2>

            {Array.from({ length: totalRatings }).map((_, index) => {
             const starNumber = index + 1;
             return (
            <Star
              key={index}
              filled={starNumber <= rating}
              onClick={() => setRating(starNumber)}
            />
            );
          })}
           </div>
             <div className="book-review-section">
             <h2 className="write-review-title">Write a review</h2>

             <textarea
                className="review-textarea"
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />
              
         
          <button
           type="button"
           className="review-submit"
           onClick={handleSubmitReview}                         
           disabled={submittingReview}                          
           >
           {submittingReview ? 'Submitting...' : 'Submit Review'}
         </button>
        
         </div>
         <div className="book-review-list" style={{ marginTop: "20px" }}>
          <h2 className="reviews-title">Reviews</h2>

          {reviewsError && <p className="error">{reviewsError}</p>}

          {reviewsLoading && !reviewsError && <p>Loading reviews...</p>}

          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <p>No reviews yet. Be the first!</p>
          )}

          {!reviewsLoading && !reviewsError && reviews.length > 0 && (
            <div>
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="review-item"
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px 0",
                    marginBottom: "8px"
                  }}
                >
                    <div>
                   <strong>{r.username}</strong> &nbsp;–&nbsp; Rating: {r.rating}/5
                   </div>
                  <div>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  {r.comment && <p>{r.comment}</p>}
                  {r.created_at && (
                    <small style={{ color: "#666" }}>
                      {new Date(r.created_at).toLocaleString()}
                    </small>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
    );
};