import React from "react";
import "./ProductInfo.css";

/**
 * ProductInfo Component
 * Hiển thị thông tin chi tiết sản phẩm: tên, giá, đánh giá, mô tả
 */
export const ProductInfo = ({
  product,
  selectedVariant,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const finalPrice = selectedVariant
    ? product.price + selectedVariant.priceModifier
    : product.price;

  const originalPrice = product.originalPrice
    ? selectedVariant
      ? product.originalPrice + selectedVariant.priceModifier
      : product.originalPrice
    : null;

  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stock > 0;

  const stockCount = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <div className="product-info">
      {/* Product Header */}
      <div className="product-header">
        <div className="brand-badge">{product.brand}</div>
        <h1 className="product-title">{product.name}</h1>
        {selectedVariant && (
          <p className="variant-name-display">
            Phiên bản: {selectedVariant.name}
          </p>
        )}
      </div>

      {/* Rating & Stock */}
      <div className="product-meta">
        <div className="rating-section">
          <span className="rating">
            ⭐ {product.rating} ({product.numReviews} đánh giá)
          </span>
        </div>
        <div className="stock-section">
          {inStock ? (
            <span className="stock in-stock">
              ✓ Còn hàng ({stockCount} sản phẩm)
            </span>
          ) : (
            <span className="stock out-of-stock">✗ Hết hàng</span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-main">
          <span className="current-price">
            {finalPrice.toLocaleString("vi-VN")}₫
          </span>
          {originalPrice && (
            <>
              <span className="original-price">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
              {product.discount && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </>
          )}
        </div>
        {product.discount && (
          <p className="savings-text">
            Tiết kiệm: {(originalPrice - finalPrice).toLocaleString("vi-VN")}₫
          </p>
        )}
      </div>

      {/* Quick Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="quick-specs">
          <h3>Thông số nổi bật:</h3>
          <div className="specs-grid">
            {Object.entries(product.specs)
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="product-description">
          <h3>Mô tả sản phẩm:</h3>
          <p>{product.description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-buy-now" disabled={!inStock} onClick={onBuyNow}>
          {inStock ? "Mua ngay" : "Hết hàng"}
        </button>
        <button
          className="btn-add-to-cart"
          disabled={!inStock}
          onClick={onAddToCart}
        >
          🛒 Thêm vào giỏ hàng
        </button>
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-item">
          <span className="icon">🚚</span>
          <div>
            <strong>Giao hàng toàn quốc</strong>
            <p>Miễn phí ship đơn từ 500.000₫</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">✓</span>
          <div>
            <strong>Bảo hành chính hãng</strong>
            <p>12 tháng bảo hành toàn quốc</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">↻</span>
          <div>
            <strong>Đổi trả dễ dàng</strong>
            <p>Trong vòng 7 ngày nếu có lỗi</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">🎁</span>
          <div>
            <strong>Quà tặng hấp dẫn</strong>
            <p>Nhiều ưu đãi khi mua hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};
