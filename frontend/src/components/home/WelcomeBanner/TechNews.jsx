import React, { useState } from 'react';

const TechNews = () => {
  const [activeTab, setActiveTab] = useState('Mới nhất');

  const categories = ['Mới nhất', 'Tin tức', 'Đánh giá', 'Tư vấn', 'Thủ thuật'];

  const newsData = [
    {
      id: 1,
      type: 'TIN TỨC',
      title: 'Black Friday 2025 - Hàng Chính Hãng Giảm Đến 50%',
      image: 'https://picsum.photos/800/500?random=1',
      author: 'Trần Hải Nhật Minh',
      date: '08/12/2025',
      isFeatured: true,
    },
    {
      id: 2,
      title: 'Laptop OLED có bền không? Tư vấn laptop OLED bền bỉ, đáng mua 2025',
      image: 'https://picsum.photos/200/120?random=2',
      author: 'Bùi Văn Nam',
      date: '08/12/2025',
    },
    {
      id: 3,
      title: 'Có nên mua laptop làm quà Giáng Sinh? Top laptop OLED ASUS giá tốt...',
      image: 'https://picsum.photos/200/120?random=3',
      author: 'Ngô Thành Nam',
      date: '08/12/2025',
    },
  ];

  return (
    <section className="py-12 bg-white font-sans">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-tight">
          Tin tức công nghệ
        </h2>

        
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
              <img
                src={newsData[0].image}
                alt={newsData[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold mb-3 tracking-widest uppercase">
                  {newsData[0].type}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                  {newsData[0].title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="font-medium text-green-400">{newsData[0].author}</span>
                  <span>/</span>
                  <span>{newsData[0].date}</span>
                </div>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-5 flex flex-col gap-6">
            {newsData.slice(1).map((item) => (
              <div key={item.id} className="flex gap-4 group cursor-pointer">
                <div className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-[15px] md:text-lg leading-snug text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[13px] text-gray-500">
                    <span className="text-green-500 font-semibold">{item.author}</span>
                    <span>/</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
            
            
            <button className="mt-2 text-green-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
              Xem tất cả bản tin <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechNews;