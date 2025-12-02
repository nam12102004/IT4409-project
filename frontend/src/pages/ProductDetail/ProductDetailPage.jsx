import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductGallery } from "../../components/ProductDetail/ProductGallery";
import { getProductById } from "../../api/mockService";
import "./ProductDetailPage.css";

/**
 * ProductDetailPage Component
 * Trang chi tiết sản phẩm
 */
export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id || 1); // Default to product ID 1 for demo
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Không tìm thấy sản phẩm</h2>
        <a href="/">Quay về trang chủ</a>
      </div>
    );
  }

  // Transform product data to match gallery format
  const galleryImages = [
    {
      id: "img1",
      url: product.image,
      alt: product.name,
      isPrimary: true,
    },
    {
      id: "img2",
      url: product.thumbnail,
      alt: `${product.name} - Góc 2`,
      isPrimary: false,
    },
  ];

  const badges = [
    "Bảo hành chính hãng 12 tháng",
    "Giao hàng miễn phí toàn quốc",
    "Đổi trả trong 7 ngày",
    product.discount ? `Giảm giá ${product.discount}%` : null,
  ].filter(Boolean);

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/">Trang chủ</a>
          <span className="breadcrumb-separator">/</span>
          <a href={`/category/${product.category.toLowerCase()}`}>
            {product.category}
          </a>
          <span className="breadcrumb-separator">/</span>
          <span className="current">{product.brand}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="product-main-content">
          {/* Left: Gallery */}
          <div className="product-gallery-section">
            <ProductGallery images={galleryImages} badges={badges} />
          </div>

          {/* Right: Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <div className="brand-badge">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                <span className="rating">
                  ⭐ {product.rating} ({product.reviewCount} đánh giá)
                </span>
                {product.stock > 0 ? (
                  <span className="stock in-stock">
                    ✓ Còn hàng ({product.stock} sản phẩm)
                  </span>
                ) : (
                  <span className="stock out-of-stock">✗ Hết hàng</span>
                )}
              </div>
            </div>

            {/* Product Specs */}
            <div className="product-specs-quick">
              <h3>Thông số nổi bật:</h3>
              <div className="specs-grid">
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-main">
                <span className="current-price">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                {product.originalPrice && (
                  <>
                    <span className="original-price">
                      {product.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                    {product.discount && (
                      <span className="discount-badge">
                        -{product.discount}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="action-buttons">
              <button className="btn-buy-now" disabled={product.stock === 0}>
                Mua ngay
              </button>
              <button
                className="btn-add-to-cart"
                disabled={product.stock === 0}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <span className="icon">🚚</span>
                <span>Giao hàng toàn quốc</span>
              </div>
              <div className="info-item">
                <span className="icon">✓</span>
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="info-item">
                <span className="icon">↻</span>
                <span>Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
