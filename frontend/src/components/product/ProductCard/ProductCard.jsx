import { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiFillStar } from "react-icons/ai";
import { BsCart3, BsCpu, BsMemory, BsDisplay } from "react-icons/bs";
import { IoMdFlame } from "react-icons/io";
import { useCart } from "../../../hooks/useCart";


const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    console.log("✅ Đã thêm vào giỏ:", product.name);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    console.log("👁️ Xem chi tiết:", product.name);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden group relative"
    >
      {/* Header */}
      <div className="relative">
        {/* Nút Yêu thích */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 left-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          {isWishlisted ? (
            <AiFillHeart className="w-5 h-5 text-red-500" />
          ) : (
            <AiOutlineHeart className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Nhãn Giảm giá */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1">
            <span>-{Math.round(product.discount)}%</span>
            <IoMdFlame className="w-4 h-4" />
          </div>
        )}

        {/* Hình ảnh*/}
        <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          {product.thumbnail || product.image ? (
            <img
              src={product.thumbnail || product.image}
              alt={product.name}
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                // Nếu ảnh lỗi, hiển thị icon
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="flex-col items-center justify-center text-gray-300"
            style={{
              display: product.thumbnail || product.image ? "none" : "flex",
            }}
          >
            <BsDisplay className="w-16 h-16 mb-2" />
            <span className="text-sm">Chưa có hình</span>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap min-h-[24px]">
          {product.isNew && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
              🆕 MỚI
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-semibold">
              🏆 BÁN CHẠY
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
              ⚠️ Còn {product.stock}
            </span>
          )}
        </div>

        {/* Tên sản phẩm */}
        <h3
          className="text-gray-800 font-semibold mb-3 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "48px",
            maxHeight: "48px",
          }}
        >
          {product.name || product.title}
        </h3>

        {/* Đánh giá */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <AiFillStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium ml-1">
              {product.rating ? product.rating.toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            ({product.reviewCount || product.stock || 0} đánh giá)
          </span>
        </div>

        {/* Specs */}
        {(product.specs || product.brand) && (
          <div className="text-xs text-gray-600 mb-3 space-y-1 min-h-[60px]">
            {product.brand && (
              <div className="flex items-center gap-1">
                <BsCpu className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{product.brand}</span>
              </div>
            )}
            {product.specs?.cpu && (
              <div className="flex items-center gap-1">
                <BsCpu className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{product.specs.cpu}</span>
              </div>
            )}
            {product.specs?.ram && product.specs?.storage && (
              <div className="flex items-center gap-1">
                <BsMemory className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {product.specs.ram} | {product.specs.storage}
                </span>
              </div>
            )}
            {product.specs?.screen && (
              <div className="flex items-center gap-1">
                <BsDisplay className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{product.specs.screen}</span>
              </div>
            )}
          </div>
        )}

        {/* Giá */}
        <div className="mb-3">
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-gray-400 text-sm line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
          <div className="text-red-600 text-xl font-bold">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Nút Thêm vào giỏ */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <BsCart3 className="w-5 h-5" />
          <span>{product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}</span>
        </button>
      </div>

      {/* Overlay hết hàng */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white px-6 py-3 rounded-lg text-red-600 font-bold shadow-xl">
            HẾT HÀNG
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
