import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BrandFilter = ({ selectedBrands = [], onBrandChange, brands = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [localBrands, setLocalBrands] = useState(brands || []);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const fetchBrands = async () => {
      if (brands && brands.length) {
        setLocalBrands(brands);
        return;
      }
      try {
        const res = await fetch("https://it4409-deploy-backend.onrender.com/api/products/brands");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setLocalBrands(data);
      } catch (e) {
        console.error("Failed to fetch brands", e);
      }
    };
    fetchBrands();
    return () => (mounted = false);
  }, [brands]);

  const displayBrands = showAll ? localBrands : localBrands.slice(0, 5);
  const params = new URLSearchParams(location.search);
  const activeBrandSlug = params.get("brand");

  const handleBrandToggle = (brand) => {
    const slug = typeof brand === "string" ? brand : brand.slug || brand.name;
    const name = typeof brand === "string" ? brand : brand.name || slug;

    const params = new URLSearchParams(location.search);
    if (params.get("brand") === slug) {
      params.delete("brand");
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
      onBrandChange && onBrandChange([]);
    } else {
      params.set("brand", slug);
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
      onBrandChange && onBrandChange([name]);
    }
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">THƯƠNG HIỆU</h3>
      <div className="filter-options">
        {displayBrands.map((brand) => {
          const name =
            typeof brand === "string"
              ? brand
              : brand.name || String(brand._id || "");
          const slug = typeof brand === "string" ? brand : brand.slug || name;
          const count = typeof brand === "object" ? brand.count || 0 : 0;
          return (
            <label key={slug} className="filter-checkbox">
              <input
                type="checkbox"
                checked={activeBrandSlug === slug}
                onChange={() => handleBrandToggle(brand)}
              />
              <span>
                {name} ({count})
              </span>
            </label>
          );
        })}

        {localBrands.length > 5 && (
          <button
            className="filter-toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : `Xem thêm ${localBrands.length - 5}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
