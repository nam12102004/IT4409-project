import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../../../data/categories.jsx";

export function CategoryList({ selectedCategory, onSelectCategory }) {
  return (
    <div className="px-5 py-8 bg-sky-50">
      <h2 className="text-2xl font-semibold mb-6">Danh mục nổi bật</h2>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center w-24 gap-2 transition-transform duration-200 ease-in-out hover:scale-105
              ${
                selectedCategory === category.id
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              }
            `}
          >
            <div
              className={`w-20 h-20 p-4 rounded-2xl transition-colors flex items-center justify-center
                ${
                  selectedCategory === category.id
                    ? "bg-blue-500"
                    : "bg-white shadow-md"
                }
              `}
            >
              <span className="text-4xl">{category.icon}</span>
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
