import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function BestSellingGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/best-selling?limit=15`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching best-selling products", err);
        setProducts([]);
      }
    };

    fetchBestSelling();
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm py-6">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">
          Sản phẩm bán chạy
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 15).map((p) => {
            const price = p.discountPrice ?? p.price ?? 0;
            const img = Array.isArray(p.images) && p.images.length ? p.images[0] : "";

            return (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg mb-3 bg-gray-50 flex items-center justify-center">
                  {img ? (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
                    {p.name}
                  </h3>
                  <div className="text-red-600 font-bold text-sm">
                    {price.toLocaleString("vi-VN")}₫
                  </div>
                  {typeof p.soldQuantity === "number" && (
                    <div className="text-xs text-gray-500">Đã bán: {p.soldQuantity}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
