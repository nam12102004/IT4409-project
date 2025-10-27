export const getCategories = async () => ["Laptop", "Phone", "Tablet"];

export const getBrands = async () => [
  "Dell",
  "Apple",
  "Samsung",
  "HP",
  "Lenovo",
  "Asus",
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(300); // Simulate network delay

  return [
    {
      id: 1,
      name: "Laptop Dell XPS 13",
      price: 25000000,
      category: "Laptop",
      brand: "Dell",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
      id: 2,
      name: "Laptop Dell Inspiron 15",
      price: 15000000,
      category: "Laptop",
      brand: "Dell",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    },
    {
      id: 3,
      name: "MacBook Air M2",
      price: 28000000,
      category: "Laptop",
      brand: "Apple",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    },
    {
      id: 4,
      name: "MacBook Pro 14",
      price: 42000000,
      category: "Laptop",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    },
    {
      id: 5,
      name: "Laptop HP Pavilion",
      price: 18000000,
      category: "Laptop",
      brand: "HP",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
      id: 6,
      name: "Laptop Lenovo ThinkPad",
      price: 22000000,
      category: "Laptop",
      brand: "Lenovo",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    },
    {
      id: 7,
      name: "Laptop Asus Zenbook",
      price: 24000000,
      category: "Laptop",
      brand: "Asus",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
      id: 8,
      name: "iPhone 15 Pro",
      price: 30000000,
      category: "Phone",
      brand: "Apple",
      image:
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    },
    {
      id: 9,
      name: "iPhone 15",
      price: 22000000,
      category: "Phone",
      brand: "Apple",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    },
    {
      id: 10,
      name: "iPhone 14",
      price: 19000000,
      category: "Phone",
      brand: "Apple",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    },
    {
      id: 11,
      name: "Samsung Galaxy S24",
      price: 26000000,
      category: "Phone",
      brand: "Samsung",
      image:
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    },
    {
      id: 12,
      name: "Samsung Galaxy A54",
      price: 14000000,
      category: "Phone",
      brand: "Samsung",
      image:
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    },
    {
      id: 13,
      name: "iPad Pro 12.9",
      price: 35000000,
      category: "Tablet",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    },
    {
      id: 14,
      name: "iPad Air",
      price: 21000000,
      category: "Tablet",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    },
    {
      id: 15,
      name: "Samsung Galaxy Tab S9",
      price: 24000000,
      category: "Tablet",
      brand: "Samsung",
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    },
    {
      id: 16,
      name: "iPad Mini",
      price: 18000000,
      category: "Tablet",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    },
  ];
};
//
