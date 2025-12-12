import React, { useState } from "react";
import "./ReviewsSection.css";

/**
 * ReviewsSection Component
 * Hiển thị danh sách đánh giá và cho phép người dùng viết đánh giá
 */
export const ReviewsSection = ({
  reviews = [],
  productRating = 0,
  onSubmitReview,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    author: "",
  });
  const [filterRating, setFilterRating] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitReview) {
      onSubmitReview(newReview);
    }
    setNewReview({ rating: 5, title: "", comment: "", author: "" });
    setShowReviewForm(false);
  };

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filterRating));

  // Tính toán phân phối đánh giá
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) *
          100
        : 0,
  }));

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Đánh giá sản phẩm</h2>

      {/* Review Summary */}
      <div className="review-summary">
        <div className="summary-left">
          <div className="average-rating">
            <span className="rating-number">{productRating.toFixed(1)}</span>
            <div className="stars-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(productRating) ? "star filled" : "star"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="total-reviews">{reviews.length} đánh giá</span>
          </div>
        </div>

        <div className="summary-right">
          <div className="rating-bars">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="rating-bar-row">
                <span className="bar-label">{star} ⭐</span>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Write Review */}
      <div className="reviews-actions">
        <div className="review-filter">
          <label>Lọc theo:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
        <button
          className="btn-write-review"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          ✍️ Viết đánh giá
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Viết đánh giá của bạn</h3>

            <div className="form-group">
              <label>Đánh giá: *</label>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= newReview.rating ? "star filled" : "star"
                    }
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Họ tên: *</label>
              <input
                type="text"
                value={newReview.author}
                onChange={(e) =>
                  setNewReview({ ...newReview, author: e.target.value })
                }
                required
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div className="form-group">
              <label>Tiêu đề: *</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                required
                placeholder="Tóm tắt đánh giá của bạn"
              />
            </div>

            <div className="form-group">
              <label>Nhận xét: *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows="5"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Gửi đánh giá
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowReviewForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <p>
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="reviewer-name">{review.author}</h4>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating ? "star filled" : "star"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>

              {review.title && <h3 className="review-title">{review.title}</h3>}

              <p className="review-comment">{review.comment}</p>

              {review.verified && (
                <div className="verified-badge">✓ Đã mua hàng</div>
              )}

              <div className="review-actions">
                <button className="btn-helpful">
                  👍 Hữu ích ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
