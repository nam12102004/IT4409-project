import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const featuredProducts = [
  {
    id: 1,
    name: "Lenovo ThinkPad X390 i5 10210U, 8GB, 256GB, HD",
    image: "https://d28jzcg6y4v9j1.cloudfront.net/backend/uploads/product/avatar/2021/7/6/photo-2021-07-06-12-14-14.jpg",
    price: 7990000,
  },
  {
    id: 2,
    name: "Dell Latitude 14 7420 i7 1185G7, 16GB, 256GB, FHD",
    image: "https://d28jzcg6y4v9j1.cloudfront.net/media/core/products/2023/10/27/thumb/dell-latitude-14-7420-7406-thumb.png",
    price: 9990000,
  },
  {
    id: 3,
    name: "Asus ExpertBook P1503CVA-i308256-50W i3 1315U, 8GB, 256GB, FHD",
    image: "https://d28jzcg6y4v9j1.cloudfront.net/media/core/products/2025/6/11/asus-expertbook-p1503cva-i308256-50w-asa.jpg",
    price: 10590000,
  },
];

export default function FeaturedProductsSlider() {
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
        <SwiperSlide key={product.id}>
          <div className="flex items-center justify-center gap-8">
            {/* Bọc ảnh bằng Link */}
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-1/2 max-h-[500px] object-contain rounded-lg shadow-md cursor-pointer"
              />
            </Link>

            {/* Bọc tên và giá bằng Link */}
            <div className="flex flex-col items-start">
              <Link to={`/product/${product.id}`}>
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