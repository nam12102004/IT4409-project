import { createContext, useState, useMemo } from "react";

export const ProductContext = createContext();

const initialProducts = [
  { id: 1, name: "Laptop A", price: 25000000, sold: 120, image: "", revenueByMonth: { Jan: 8000000, Feb: 12000000, Mar: 5000000 } },
  { id: 2, name: "Phone B", price: 15000000, sold: 90, image: "", revenueByMonth: { Jan: 5000000, Feb: 6000000, Mar: 7000000 } },
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (data) => {
    setProducts([...products, { id: Date.now(), ...data }]);
  };

  const updateProduct = (id, data) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalRevenue = useMemo(() =>
    products.reduce((sum, p) => sum + Object.values(p.revenueByMonth || {}).reduce((s, v) => s + v, 0), 0),
    [products]
  );

  const monthlyRevenueData = useMemo(() => {
    const acc = {};
    products.forEach(p => {
      Object.entries(p.revenueByMonth || {}).forEach(([m, v]) => {
        acc[m] = (acc[m] || 0) + v;
      });
    });
    return Object.entries(acc).map(([month, revenue]) => ({ month, revenue }));
  }, [products]);

  const topProducts = useMemo(() => [...products].sort((a, b) => b.sold - a.sold).slice(0, 5), [products]);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, totalRevenue, monthlyRevenueData, topProducts }}>
      {children}
    </ProductContext.Provider>
  );
}