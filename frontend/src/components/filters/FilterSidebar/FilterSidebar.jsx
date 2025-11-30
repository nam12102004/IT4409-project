import React from "react";
import CheckboxFilter from "./CheckboxFilter";
import NestedCheckboxFilter from "./NestedCheckboxFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import "./FilterSidebar.css";

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.needs.length > 0 ||
    filters.priceRange !== null ||
    filters.sources.length > 0 ||
    filters.conditions.length > 0 ||
    filters.cpus.length > 0 ||
    filters.rams.length > 0 ||
    filters.ssds.length > 0 ||
    filters.screenSizes.length > 0 ||
    filters.refreshRates.length > 0 ||
    filters.resolutions.length > 0 ||
    filters.advanced.length > 0 ||
    filters.colors.length > 0;

  // Dữ liệu tĩnh cho các bộ lọc
  const brandOptions = [
    "Lenovo",
    "Asus",
    "Dell",
    "Acer",
    "Microsoft",
    "Apple",
    "HP",
  ];

  const needOptions = [
    "Sinh viên",
    "Văn phòng",
    "Gaming",
    "Lập trình",
    "Đồ họa",
    "Laptop AI",
    "Mỏng nhẹ",
  ];

  const sourceOptions = ["Chính hãng", "Nhập khẩu"];

  const conditionOptions = ["Mới, Sealed", "Mới, Full box", "Outlet", "Used"];

  const cpuCategories = [
    {
      name: "Intel",
      options: [
        "Core 5",
        "Core 7",
        "Core i3",
        "Core i5",
        "Core i7",
        "Core i9",
        "Core Ultra 5",
        "Core Ultra 7",
        "Core Ultra 9",
      ],
    },
    {
      name: "AMD",
      options: ["Ryzen 5", "Ryzen 7", "Ryzen 9"],
    },
    {
      name: "Apple",
      options: ["M1", "M2"],
    },
    {
      name: "Qualcomm",
      options: ["Snapdragon X Elite", "Snapdragon X Plus"],
    },
  ];

  const ramOptions = [
    "8 GB",
    "12 GB",
    "16 GB",
    "24 GB",
    "32 GB",
    "48 GB",
    "64 GB",
  ];

  const ssdOptions = ["256 GB", "512 GB"];

  const screenSizeOptions = [
    "Khoảng 13 inches",
    "Khoảng 14 inches",
    "Khoảng 15 inches",
    "Trên 16 inches",
  ];

  const refreshRateOptions = [
    "60 Hz",
    "90 Hz",
    "120 Hz",
    "144 Hz",
    "165 Hz",
    "240 Hz",
  ];

  const resolutionOptions = ["2K", "3K", "4K", "FHD"];

  const advancedOptions = ["Cảm ứng", "100% sRGB", "OLED"];

  const colorOptions = ["Đen", "Trắng", "Xám", "Vàng", "Xanh lá", "Xanh dương"];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2 className="filter-main-title">🔍 BỘ LỌC</h2>
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={onClearFilters}>
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="filter-content">
        <CheckboxFilter
          title="Thương hiệu"
          options={brandOptions}
          selectedValues={filters.brands}
          onChange={(brands) => onFilterChange("brands", brands)}
        />

        <CheckboxFilter
          title="Nhu cầu"
          options={needOptions}
          selectedValues={filters.needs}
          onChange={(needs) => onFilterChange("needs", needs)}
        />

        <PriceRangeFilter
          selectedPriceRange={filters.priceRange}
          onPriceRangeChange={(range) => onFilterChange("priceRange", range)}
        />

        <CheckboxFilter
          title="Nguồn hàng"
          options={sourceOptions}
          selectedValues={filters.sources}
          onChange={(sources) => onFilterChange("sources", sources)}
          showAll={true}
        />

        <CheckboxFilter
          title="Tình trạng"
          options={conditionOptions}
          selectedValues={filters.conditions}
          onChange={(conditions) => onFilterChange("conditions", conditions)}
          showAll={true}
        />

        <NestedCheckboxFilter
          title="Loại CPU"
          categories={cpuCategories}
          selectedValues={filters.cpus}
          onChange={(cpus) => onFilterChange("cpus", cpus)}
        />

        <CheckboxFilter
          title="Dung lượng RAM"
          options={ramOptions}
          selectedValues={filters.rams}
          onChange={(rams) => onFilterChange("rams", rams)}
          showAll={true}
        />

        <CheckboxFilter
          title="Dung lượng SSD"
          options={ssdOptions}
          selectedValues={filters.ssds}
          onChange={(ssds) => onFilterChange("ssds", ssds)}
          showAll={true}
        />

        <CheckboxFilter
          title="Kích thước màn hình"
          options={screenSizeOptions}
          selectedValues={filters.screenSizes}
          onChange={(screenSizes) => onFilterChange("screenSizes", screenSizes)}
          showAll={true}
        />

        <CheckboxFilter
          title="Tần số quét"
          options={refreshRateOptions}
          selectedValues={filters.refreshRates}
          onChange={(refreshRates) =>
            onFilterChange("refreshRates", refreshRates)
          }
        />

        <CheckboxFilter
          title="Loại phân giải"
          options={resolutionOptions}
          selectedValues={filters.resolutions}
          onChange={(resolutions) => onFilterChange("resolutions", resolutions)}
          showAll={true}
        />

        <CheckboxFilter
          title="Nâng cao"
          options={advancedOptions}
          selectedValues={filters.advanced}
          onChange={(advanced) => onFilterChange("advanced", advanced)}
          showAll={true}
        />

        <CheckboxFilter
          title="Màu sắc"
          options={colorOptions}
          selectedValues={filters.colors}
          onChange={(colors) => onFilterChange("colors", colors)}
        />
      </div>

      {hasActiveFilters && (
        <div className="filter-footer">
          <button className="clear-footer-btn" onClick={onClearFilters}>
            🗑️ Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
