import React, { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiSearch,
  FiMapPin,
  FiUser,
  FiShoppingCart,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { categories } from "../../../data/categories";

function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const brands = {
    laptop: ["Lenovo", "Dell", "Asus", "Acer", "Apple", "HP"],
    subcategories: [
      {
        name: "Dell",
        items: ["XPS", "Inspiron", "Precision", "Latitude", "Alienware"],
      },
      { name: "HP", items: ["Zbook", "Pavilion"] },
      { name: "Microsoft", items: ["Surface Pro", "Surface Laptop"] },
      { name: "Lenovo", items: ["ThinkPad", "Yoga", "ThinkBook"] },
      { name: "Acer", items: ["Lenovo", "Dell"] },
    ],
  };

  return (
    <header className="bg-sky-100 px-8 py-4 flex justify-between items-center border-b border-sky-200 font-sans z-10 relative">
      <div className="flex items-center gap-5">
        <div className="text-3xl font-bold text-blue-500 relative pr-2.5">
          Tech-Geeks
          <span className="w-1 h-6 bg-orange-500 rounded absolute right-0 top-1/2 -translate-y-1/2"></span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-800 font-medium text-sm bg-white px-3 py-2 rounded-lg shadow-sm hover:text-blue-500"
          >
            <FiMenu />
            <span>Sản phẩm</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 w-[900px] p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Cột 1: Danh mục sản phẩm */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    Gợi ý cho bạn
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {brands.laptop.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          navigate(`/products/laptop?brand=${brand}`);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-blue-500 hover:text-blue-500"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {categories.slice(0, 10).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(`/products/${category.slug}`);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cột 2 & 3: Thương hiệu và dòng sản phẩm */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {brands.subcategories.map((brand) => (
                    <div key={brand.name}>
                      <h4
                        onClick={() => {
                          navigate(`/products/laptop?brand=${brand.name}`);
                          setIsDropdownOpen(false);
                        }}
                        className="font-bold text-gray-800 mb-2 flex items-center gap-2 cursor-pointer hover:text-blue-500"
                      >
                        {brand.name}
                        <FiChevronRight className="text-gray-400" />
                      </h4>
                      <div className="space-y-1">
                        {brand.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              navigate(
                                `/products/laptop?brand=${brand.name}&model=${item}`
                              );
                              setIsDropdownOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-500"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow mx-8 max-w-xl relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Xin chào, bạn đang tìm gì?"
          className="w-full pl-12 pr-5 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Icons & Giỏ hàng (Code theo logic mới của Team) */}
      <div className="flex items-center gap-5">
        <a
          href="#"
          className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500"
        >
          <FiMapPin />
          <span>Địa chỉ cửa hàng</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500"
        >
          <FiUser />
          <span>Đăng nhập</span>
        </a>

        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 bg-cyan-400 text-white rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-cyan-500"
        >
          <FiShoppingCart />
          <span>Giỏ hàng</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
