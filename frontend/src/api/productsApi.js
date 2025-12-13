import axios from "axios";

const API_BASE_URL = "https://it4409-deploy-backend.onrender.com/api";

export const getProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/products`);
  const data = res.data || [];

  return data.map((p) => {
    const originalPrice = p.price ?? 0;
    const discountPrice = p.discountPrice ?? originalPrice;
    const discount = originalPrice > 0
      ? Math.round((1 - discountPrice / originalPrice) * 100)
      : 0;

    return {
      id: p._id,
      name: p.name,
      brand: p.brand,
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
