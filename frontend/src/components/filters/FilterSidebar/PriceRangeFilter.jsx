import React, { useState, useEffect, useRef } from "react";

const PriceRangeFilter = ({ selectedPriceRange, onPriceRangeChange }) => {
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const debounceTimeout = useRef(null);

  const priceRanges = [
    { label: "Tất cả", min: 0, max: Infinity },
    { label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
    { label: "30 - 40 triệu", min: 30000000, max: 40000000 },
    { label: "Trên 40 triệu", min: 40000000, max: Infinity },
  ];

  const handleRangeSelect = (range) => {
    onPriceRangeChange(range);
    setCustomMin("");
    setCustomMax("");
  };

  const handleCustomApply = () => {
    const min = parseFloat(customMin) * 1000000 || 0;
    const max = parseFloat(customMax) * 1000000 || Infinity;

    if (min < max) {
      onPriceRangeChange({ min, max, label: "Tùy chỉnh" });
    }
  };

  // Debounced auto-apply for custom price
  useEffect(() => {
    if (customMin || customMax) {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set new timeout (300ms delay)
      debounceTimeout.current = setTimeout(() => {
        const min = parseFloat(customMin) * 1000000 || 0;
        const max = parseFloat(customMax) * 1000000 || Infinity;

        if (min < max && (customMin || customMax)) {
          onPriceRangeChange({ min, max, label: "Tùy chỉnh" });
        }
      }, 300);
    }

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [customMin, customMax, onPriceRangeChange]);

  const isSelected = (range) => {
    if (!selectedPriceRange) return range.min === 0 && range.max === Infinity;
    return (
      selectedPriceRange.min === range.min &&
      selectedPriceRange.max === range.max
    );
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">💰 KHOẢNG GIÁ</h3>
      <div className="filter-options">
        {priceRanges.map((range, index) => (
          <label key={index} className="filter-radio">
            <input
              type="radio"
              name="priceRange"
              checked={isSelected(range)}
              onChange={() => handleRangeSelect(range)}
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>

      <div className="custom-price-input">
        <div className="price-input-label">Hoặc nhập khoảng giá:</div>
        <div className="price-input-row">
          <input
            type="number"
            placeholder="Từ"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            placeholder="Đến"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="price-input"
          />
        </div>
        <div className="price-input-unit">Đơn vị: triệu VNĐ</div>
        <button
          className="price-apply-btn"
          onClick={handleCustomApply}
          disabled={!customMin && !customMax}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
