import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductGallery } from "../../components/ProductDetail/ProductGallery";
import { ProductInfo } from "../../components/ProductDetail/ProductInfo";
import { VariantSelector } from "../../components/ProductDetail/VariantSelector";
import { SpecificationsTable } from "../../components/ProductDetail/SpecificationsTable";
import { ReviewsSection } from "../../components/ProductDetail/ReviewsSection";
import { getProductById } from "../../api/mockService";
import "./ProductDetailPage.css";

/**
 * ProductDetailPage Component
 * Trang chi tiết sản phẩm
 */
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id || 1); // Default to product ID 1 for demo
        setProduct(data);
        // Set default variant if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", product, selectedVariant);
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log("Buy now:", product, selectedVariant);
    alert("Chuyển đến trang thanh toán...");
    // navigate("/checkout");
  };

  const handleSubmitReview = (review) => {
    // TODO: Implement submit review functionality
    console.log("New review:", review);
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

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
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && (
          <SpecificationsTable specifications={product.specifications} />
        )}

        {/* Reviews Section */}
        <ReviewsSection
          reviews={product.reviews || []}
          productRating={product.rating}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};
