import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Cache để tránh gọi API lặp lại
let productsCache = null;
let productsCacheTime = 0;
const CACHE_DURATION = 60000; // 1 phút

// Helper function để transform product data
const transformProduct = (p) => {
  const originalPrice = p.price ?? 0;
  const discountPrice = p.discountPrice ?? originalPrice;
  const discount =
    originalPrice > 0
      ? Math.round((1 - discountPrice / originalPrice) * 100)
      : 0;

  return {
    id: p._id,
    name: p.name,
    brand: p.brand,
    category:
      typeof p.category === "string" ? p.category : p.category?.name || "",
    subcategory: "",
    price: discountPrice,
    originalPrice: originalPrice,
    discount,
    rating: p.rating ?? 0,
    numReviews: p.numReviews ?? 0,
    stock: p.stock ?? 0,
    image: (p.images && p.images[0]) || null,
    images: p.images || [],
    thumbnail: (p.images && p.images[0]) || null,
    specs: p.specifications || {},
    specifications: p.specifications || {},
    variants: p.variants || [],
    highlights: p.highlights || [],
    description: p.description || "",
    warranty: p.warranty || "12 tháng",
    origin: p.origin || "",
    isNew: p.isNew ?? false,
    isBestSeller: p.isBestSeller ?? false,
  };
};

export const getProducts = async () => {
  // Kiểm tra cache còn hợp lệ không
  const now = Date.now();
  if (productsCache && now - productsCacheTime < CACHE_DURATION) {
    return productsCache;
  }

  const res = await axios.get(`${API_BASE_URL}/products`);
  const data = res.data || [];

  const products = data.map(transformProduct);

  // Lưu vào cache
  productsCache = products;
  productsCacheTime = now;

  return products;
};

// Xóa cache khi cần (sau khi tạo/sửa/xóa sản phẩm)
export const clearProductsCache = () => {
  productsCache = null;
  productsCacheTime = 0;
};

export const getProductById = async (productId) => {
  try {
    // Gọi API endpoint riêng cho single product - nhanh hơn nhiều
    const res = await axios.get(`${API_BASE_URL}/products/${productId}`);
    const p = res.data;

    if (!p) return null;

    return transformProduct(p);
  } catch (error) {
    console.warn("API /products/:id failed, checking cache...");

    // Fallback 1: Kiểm tra cache trước
    if (productsCache) {
      const found = productsCache.find(
        (p) => String(p.id) === String(productId)
      );
      if (found) return found;
    }

    // Fallback 2: Load tất cả (chậm nhất)
    console.log("Fallback to getProducts for single product");
    const products = await getProducts();
    return products.find((p) => String(p.id) === String(productId));
  }
};
