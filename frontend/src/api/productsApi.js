import axios from "axios";
import {
  getFilterTypeBySlug,
  getFilterConfig,
} from "../config/filterConfig";

const API_BASE_URL = "http://localhost:5000/api";

// Helper: kiểm tra xem string có phải là ObjectId không
const isObjectId = (str) => {
  if (typeof str !== "string") return false;
  return /^[a-f\d]{24}$/i.test(str);
};

// Fetch all brands - dùng để map brandId -> brandName
export const getBrands = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/brands`);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Cache brands để không phải fetch nhiều lần
let brandMapCache = null;

const getBrandMap = async () => {
  if (brandMapCache) return brandMapCache;

  const brands = await getBrands();
  brandMapCache = {};
  brands.forEach((b) => {
    brandMapCache[b._id] = b.name;
  });
  return brandMapCache;
};

export const getProducts = async () => {
  try {
    // Fetch products và brands song song
    const [productsRes, brandMap] = await Promise.all([
      axios.get(`${API_BASE_URL}/products`),
      getBrandMap(),
    ]);

    const data = productsRes.data || [];

    return data.map((p) => {
      const originalPrice = p.price ?? 0;
      const discountPrice = p.discountPrice ?? originalPrice;
      const discount =
        originalPrice > 0
          ? Math.round((1 - discountPrice / originalPrice) * 100)
          : 0;

      // Chuẩn hóa brand về dạng tên chuỗi
      let brandName = "";
      if (typeof p.brand === "string") {
        if (isObjectId(p.brand)) {
          // Nếu là ObjectId string, lookup từ brandMap
          brandName = brandMap[p.brand] || "";
        } else {
          // Nếu là tên brand, giữ nguyên
          brandName = p.brand;
        }
      } else if (p.brand?.name) {
        // Nếu đã được populate
        brandName = p.brand.name;
      } else if (p.brand?._id) {
        // Nếu populate nhưng chỉ có _id
        brandName = brandMap[p.brand._id] || "";
      }

      // Chuẩn hóa category về dạng tên chuỗi
      let categoryName = "";
      if (typeof p.category === "string") {
        categoryName = p.category;
      } else if (p.category?.name) {
        categoryName = p.category.name;
      }

      return {
        id: p._id,
        name: p.name,
        brand: brandName,
        category: categoryName,
        subcategory: "",
        price: discountPrice,
        originalPrice,
        discount,
        rating: p.ratings?.average ?? 0,
        reviewCount: p.ratings?.count ?? 0,
        stock: p.stock ?? 0,
        image: (p.images && p.images[0]) || null,
        thumbnail: (p.images && p.images[0]) || null,
        specs: p.specifications || p.features || {},
        isNew: p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (productId) => {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(productId));
};

// Lấy danh sách sản phẩm theo slug danh mục (nếu cần lọc ở frontend)
export const getProductsByCategorySlug = async (slug) => {
  const products = await getProducts();
  if (!slug) return products;

  const normalized = String(slug).toLowerCase();

  return products.filter((p) => {
    const category = (p.category || "").toLowerCase();
    const subcategory = (p.subcategory || "").toLowerCase();
    return category.includes(normalized) || subcategory.includes(normalized);
  });
};

// Lấy sản phẩm + cấu hình bộ lọc dựa trên slug danh mục
export const getProductsWithFilterConfig = async (slug) => {
  const filterType = getFilterTypeBySlug(slug);
  const filterConfig = getFilterConfig(filterType);

  const products = await getProductsByCategorySlug(slug);

  return {
    products,
    filterConfig,
    filterType,
  };
};
