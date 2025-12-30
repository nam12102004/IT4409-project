import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductGallery } from "../../components/ProductDetail/ProductGallery";
import { ProductInfo } from "../../components/ProductDetail/ProductInfo";
import { VariantSelector } from "../../components/ProductDetail/VariantSelector";
import { SpecificationsTable } from "../../components/ProductDetail/SpecificationsTable";
import { ReviewsSection } from "../../components/ProductDetail/ReviewsSection";
import { getProductById } from "../../api/productsApi";
import SEO from "../../components/common/SEO";
import Breadcrumb from "../../components/common/Breadcrumb";
import { categoryNameToSlug } from "../../data/categories";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../contexts/ToastContext";
import "./ProductDetailPage.css";
import { getReviews } from "../../api/reviewApi";
import { createReview } from "../../api/reviewApi";
/**
 * ProductDetailPage Component
 * Trang chi tiết sản phẩm
 */
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { success } = useToast();
  const [selectedVariant, setSelectedVariant] = useState(null);
  // ===== REVIEW STATE =====
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");

  // Sử dụng React Query để cache product
  const {
    data: product,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    cacheTime: 10 * 60 * 1000,
    enabled: !!id,
    onSuccess: (data) => {
      // Set variant mặc định khi load xong
      if (data?.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(data.variants[0]);
      }
    },
  });

  // Load reviews riêng
  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      try {
        const reviewRes = await getReviews(id);
        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error("Error loading reviews:", error);
        setReviews([]);
      }
    };
    loadReviews();
  }, [id]);

  // Set variant mặc định khi product thay đổi
  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = () => {
    if (!product) return;

    // Tạo object sản phẩm để thêm vào giỏ
    const cartItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.images?.[0] || product.image,
      newPrice: selectedVariant?.price || product.newPrice || product.price,
      oldPrice: product.oldPrice,
      variant: selectedVariant?.name || null,
      specs: product.specifications,
    };

    // Thêm vào giỏ hàng
    addToCart(cartItem);

    // Hiển thị thông báo và mở popup giỏ hàng
    success("Đã thêm sản phẩm vào giỏ hàng!");
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Tạo object sản phẩm để thêm vào giỏ
    const cartItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.images?.[0] || product.image,
      newPrice: selectedVariant?.price || product.newPrice || product.price,
      oldPrice: product.oldPrice,
      variant: selectedVariant?.name || null,
      specs: product.specifications,
    };

    // Thêm vào giỏ hàng và mở form thanh toán ngay
    addToCart(cartItem);
    setIsCheckoutOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      await createReview(id, {
        rating,
        comment,
        userName: guestName,
      });

      const res = await getReviews(id);
      setReviews(res.data);

      setRating(5);
      setComment("");
      setGuestName("");

      success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <SEO title="Đang tải sản phẩm..." />
        <div className="spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <SEO title="Không tìm thấy sản phẩm" />
        <h2>Không tìm thấy sản phẩm</h2>
        <a href="/">Quay về trang chủ</a>
      </div>
    );
  }

  // ===== BREADCRUMB LOGIC ===== (Tính toán động, không dùng hook)
  const breadcrumbItems = (() => {
    const items = [
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products" },
    ];

    // Thêm category nếu có
    if (product.category) {
      const categoryName =
        typeof product.category === "string"
          ? product.category
          : product.category.name;

      const categorySlug = categoryNameToSlug[categoryName];

      if (categorySlug) {
        items.push({
          label: categoryName,
          path: `/products/${categorySlug}`,
        });
      }
    }

    // Thêm tên sản phẩm hiện tại
    items.push({
      label: product.name,
      path: `/product/${product.id}`,
    });

    return items;
  })();

  // Tạo SEO data từ product
  const productTitle = `${product.name} - ${formatPrice(product.price)}`;
  const productDescription = product.description
    ? product.description.slice(0, 160)
    : `Mua ${product.name} chính hãng, giá ${formatPrice(
        product.price
      )}. Bảo hành 12 tháng, giao hàng toàn quốc.`;
  const productImage =
    product.images?.[0] || product.image || "/placeholder.png";

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

  // ===== TÍNH RATING TỪ REVIEWS =====
  const reviewCount = reviews.length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="product-detail-page">
      {/* ===== SEO META TAGS ===== */}
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={`${product.name}, ${product.brand?.name || ""}, ${
          product.category?.name || ""
        }, laptop, mua laptop, tech geeks`}
        image={productImage}
      />

      <div className="product-detail-container">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Content Grid */}
        <div className="product-main-content">
          {/* Left: Gallery */}
          <div className="product-gallery-section">
            <ProductGallery images={galleryImages} badges={badges} />
          </div>

          {/* Right: Product Info */}
          <div className="product-info-section">
            <ProductInfo
              product={{
                ...product,
                rating: averageRating,
                numReviews: reviewCount,
              }}
              selectedVariant={selectedVariant}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && (
          <SpecificationsTable specifications={product.specifications} />
        )}

        {/* Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          productRating={averageRating}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          guestName={guestName}
          setGuestName={setGuestName}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};
