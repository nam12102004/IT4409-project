import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import { getProducts } from "../../../api/productsApi";
import OptimizedImage from "../OptimizedImage";
import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Debounce search term để tránh gọi API liên tục
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Xử lý tìm kiếm khi debounced value thay đổi
  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const allProducts = await getProducts();
        const filtered = allProducts
          .filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              product.brand
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              product.category
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
          )
          .slice(0, 8); // Chỉ lấy 8 gợi ý đầu tiên

        setSuggestions(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  // Đóng suggestions khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.id}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-semibold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Xin chào, bạn đang tìm gì?"
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="clear-button"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && searchTerm.trim().length >= 2 && (
        <div className="suggestions-dropdown">
          {loading ? (
            <div className="suggestions-loading">
              <div className="spinner"></div>
              <span>Đang tìm kiếm...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="suggestions-list">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      className="suggestion-image"
                      placeholder="/placeholder-blur.svg"
                      fallback="/image-not-found.svg"
                    />
                    <div className="suggestion-info">
                      <div className="suggestion-name">
                        {highlightText(product.name, searchTerm)}
                      </div>
                      <div className="suggestion-meta">
                        <span className="suggestion-brand">
                          {product.brand}
                        </span>
                        <span className="suggestion-price">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="suggestions-footer">
                <button
                  onClick={handleSearchSubmit}
                  className="view-all-button"
                >
                  Xem tất cả {suggestions.length} kết quả cho "{searchTerm}"
                </button>
              </div>
            </>
          ) : (
            <div className="suggestions-empty">
              <FiSearch className="empty-icon" />
              <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
