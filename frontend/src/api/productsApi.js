import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const getProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/products`);
  const data = res.data || [];

  return data.map((p) => {
    const originalPrice = p.price ?? 0;
    const discountPrice = p.discountPrice ?? originalPrice;
    const discount = originalPrice > 0
      ? Math.round((1 - discountPrice / originalPrice) * 100)
      : 0;

    // Chuẩn hóa brand về dạng tên chuỗi để phục vụ filter/search ở frontend
    const brandName =
      typeof p.brand === "string"
        ? p.brand
        : p.brand?.name || "";

    return {
      id: p._id,
      name: p.name,
      brand: brandName,
      category:
        typeof p.category === "string"
          ? p.category
          : p.category?.name || "",
      subcategory: "",
      price: discountPrice,
      originalPrice: originalPrice,
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
};

export const getProductById = async (productId) => {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(productId));
};
