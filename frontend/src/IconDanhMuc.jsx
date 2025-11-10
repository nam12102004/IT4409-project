import React from 'react';
import { categories } from './Danhmucsanpham';  


export function CategoryList({ selectedCategory, onSelectCategory }) {
  return (
    <div className="px-5 py-8 bg-sky-50">
      <h2 className="text-2xl font-semibold mb-6">Danh mục nổi bật</h2>
      
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            
            className={`flex flex-col items-center w-24 gap-2 transition-transform duration-200 ease-in-out hover:scale-105
              ${selectedCategory === category.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
            `}
          >
            
            <div 
              className={`w-20 h-20 p-4 rounded-2xl transition-colors
                ${selectedCategory === category.id ? 'bg-blue-500' : 'bg-white shadow-md'}
              `}
            >
              <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}