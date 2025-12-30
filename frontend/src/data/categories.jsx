// Helper function để tạo slug từ tên tiếng Việt
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// 16 danh mục khớp với DEFAULT_CATEGORIES trong backend
export const categories = [
  {
    id: "laptop-nhap-khau",
    slug: "laptop-nhap-khau",
    name: "Laptop nhập khẩu",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/logo/laptop-nhap-khau-khong-nen.png",
    filterType: "laptop", // Dùng để xác định loại bộ lọc
  },
  {
    id: "laptop-chinh-hang",
    slug: "laptop-chinh-hang",
    name: "Laptop chính hãng",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/logo/laptop-chinh-hang-khong-nen.png",
    filterType: "laptop",
  },
  {
    id: "man-hinh-di-dong",
    slug: "man-hinh-di-dong",
    name: "Màn hình di động",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/10/3/man-hinh-di-dong-aoc-16t10-74-2-5f95555fab274fe8abc3b5230feeadd4-master-dfz.png",
    filterType: "monitor",
  },
  {
    id: "may-choi-game-game-console",
    slug: "may-choi-game-game-console",
    name: "Máy chơi game/Game Console",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/25/danh-muc-icon-may-choi-game-game-console-thinkpro.vn.png",
    filterType: "gaming",
  },
  {
    id: "kinh-thuc-te-ao-vr-ar",
    slug: "kinh-thuc-te-ao-vr-ar",
    name: "Kính Thực Tế Ảo VR/AR",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/3/27/danh-muc-icon-kinh-thuc-te-ao-vrar-thinkpro.vn.png",
    filterType: "vr",
  },
  {
    id: "ban-phim",
    slug: "ban-phim",
    name: "Bàn phím",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/24/danh-muc-icon-ban-phim-thinkpro.vn.png",
    filterType: "keyboard",
  },
  {
    id: "chuot",
    slug: "chuot",
    name: "Chuột",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d2j0501oehjiz9.cloudfront.net/media/core/categories/2024/12/12/chuot.png",
    filterType: "mouse",
  },
  {
    id: "balo-tui",
    slug: "balo-tui",
    name: "Balo, Túi",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/24/danh-muc-icon-balo-tui-thinkpro.vn.png",
    filterType: "accessory",
  },
  {
    id: "ghe-cong-thai-hoc",
    slug: "ghe-cong-thai-hoc",
    name: "Ghế công thái học",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/23/danh-muc-icon-ghe-cong-thai-hoc-thinkpro.vn.png",
    filterType: "furniture",
  },
  {
    id: "ban-nang-ha",
    slug: "ban-nang-ha",
    name: "Bàn nâng hạ",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/18/danh-muc-icon-ban-nang-ha-thinkpro.vn.png",
    filterType: "furniture",
  },
  {
    id: "hoc-tu",
    slug: "hoc-tu",
    name: "Hộc tủ",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2022/12/14/danh-muc-icon-hoc-tu-thinkpro.vn.png",
    filterType: "furniture",
  },
  {
    id: "arm-man-hinh",
    slug: "arm-man-hinh",
    name: "Arm màn hình",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2022/3/15/danh-muc-icon-arm-man-hinh-thinkpro.vn.png",
    filterType: "accessory",
  },
  {
    id: "phu-kien-setup",
    slug: "phu-kien-setup",
    name: "Phụ kiện Setup",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/30/danh-muc-icon-phu-kien-setup-thinkpro.vn.png",
    filterType: "accessory",
  },
  {
    id: "ram",
    slug: "ram",
    name: "RAM",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/1/20/32d4sam3200-512x512-png.png",
    filterType: "component",
  },
  {
    id: "o-cung",
    slug: "o-cung",
    name: "Ổ cứng",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/1/20/samsung-990-512x512png.png",
    filterType: "component",
  },
  {
    id: "merchandise",
    slug: "merchandise",
    name: "Merchandise",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/8/21/vyuj.png",
    filterType: "other",
  },
];

// Mapping từ slug URL sang tên category trong database
export const slugToCategoryName = {
  "laptop-nhap-khau": "Laptop nhập khẩu",
  "laptop-chinh-hang": "Laptop chính hãng",
  "man-hinh-di-dong": "Màn hình di động",
  "may-choi-game-game-console": "Máy chơi game/Game Console",
  "kinh-thuc-te-ao-vr-ar": "Kính Thực Tế Ảo VR/AR",
  "ban-phim": "Bàn phím",
  chuot: "Chuột",
  "balo-tui": "Balo, Túi",
  "ghe-cong-thai-hoc": "Ghế công thái học",
  "ban-nang-ha": "Bàn nâng hạ",
  "hoc-tu": "Hộc tủ",
  "arm-man-hinh": "Arm màn hình",
  "phu-kien-setup": "Phụ kiện Setup",
  ram: "RAM",
  "o-cung": "Ổ cứng",
  merchandise: "Merchandise",
};

// Mapping ngược từ tên category sang slug
export const categoryNameToSlug = Object.fromEntries(
  Object.entries(slugToCategoryName).map(([slug, name]) => [name, slug])
);

// Lấy category info từ slug
export const getCategoryBySlug = (slug) => {
  return categories.find((cat) => cat.slug === slug);
};

// Lấy filterType từ slug
export const getFilterTypeBySlug = (slug) => {
  const category = getCategoryBySlug(slug);
  return category?.filterType || "default";
};
