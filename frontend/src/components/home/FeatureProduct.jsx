import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function FeaturedProductsSlider() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const ids = "69518fed2d72ac9b603c6c8e,69518fed2d72ac9b603c6c98,69518fed2d72ac9b603c6c97,6952449d388709b10e7fc548";

    fetch(`http://localhost:5000/api/products/featured?ids=${ids}`)
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data))
      .catch((err) => console.error("Error fetching featured products:", err));
  }, []);

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
    >
      {featuredProducts.map((product) => (
        <SwiperSlide key={product._id}>
          {/* Thêm border + padding cho khung sản phẩm */}
          <div className="flex items-center justify-center gap-8 border border-gray-300 rounded-xl shadow-lg p-6 bg-white">
            
            {/* Bọc ảnh bằng Link */}
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-1/2 max-h-[500px] object-contain rounded-lg border border-gray-200 shadow-md cursor-pointer"
              />
            </Link>

            {/* Bọc tên và giá bằng Link */}
            <div className="flex flex-col items-start">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <p className="text-2xl text-orange-500 font-bold">
                {product.price.toLocaleString()}₫
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
