// Cấu hình bộ lọc cho từng loại danh mục sản phẩm

// ========== BỘ LỌC CƠ BẢN (Dùng cho hầu hết các danh mục) ==========
// Chỉ có: Thương hiệu, Giá, Màu sắc
const basicFilters = {
  brands: true,
  priceRange: true,
  colors: [
    "Đen",
    "Trắng",
    "Xám",
    "Bạc",
    "Xanh dương",
    "Xanh lá",
    "Đỏ",
    "Vàng",
    "Hồng",
  ],
};

// ========== BỘ LỌC CHO LAPTOP ==========
// Chỉ có: Thương hiệu, Giá, RAM, SSD
const laptopFilters = {
  brands: true,
  priceRange: true,
  rams: ["8GB", "16GB", "32GB", "64GB"],
  ssds: ["256GB", "512GB", "1TB", "2TB"],
};

// ========== MAPPING FILTER TYPE -> FILTER CONFIG ==========
export const filterConfigByType = {
  laptop: laptopFilters, // Laptop: Thương hiệu, Giá, RAM, SSD
  monitor: basicFilters,
  keyboard: basicFilters,
  mouse: basicFilters,
  gaming: basicFilters,
  vr: basicFilters,
  furniture: basicFilters,
  accessory: basicFilters,
  component: basicFilters,
  other: basicFilters,
  default: basicFilters,
};

// Lấy cấu hình filter theo filterType
export const getFilterConfig = (filterType) => {
  return filterConfigByType[filterType] || filterConfigByType.default;
};

// Export các filter
export { laptopFilters, basicFilters };
