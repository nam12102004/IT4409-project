import React, { useState } from "react";

const BrandFilter = ({ selectedBrands, onBrandChange, brands }) => {
  const [showAll, setShowAll] = useState(false);
  const displayBrands = showAll ? brands : brands.slice(0, 5);

  const handleBrandToggle = (brandName) => {
    const newBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    onBrandChange(newBrands);
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">🏢 THƯƠNG HIỆU</h3>
      <div className="filter-options">
        {displayBrands.map((brand) => (
          <label key={brand.name} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.name)}
              onChange={() => handleBrandToggle(brand.name)}
            />
            <span>
              {brand.name} ({brand.count})
            </span>
          </label>
        ))}

        {brands.length > 5 && (
          <button
            className="filter-toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "− Thu gọn" : `+ Xem thêm ${brands.length - 5}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
