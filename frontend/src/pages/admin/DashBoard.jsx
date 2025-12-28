import { useContext } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { totalRevenue, monthlyRevenueData, topProducts } = useContext(ProductContext);

  const quickStats = [
    { label: "Tổng doanh thu", value: `${totalRevenue.toLocaleString()}₫` },
    { label: "Số sản phẩm", value: topProducts.length.toString() },
    { label: "Top bán chạy", value: topProducts[0]?.name || "-" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Trang tổng quan quản trị</h2>

      {/* Chỉ số nhanh */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-600">{s.label}</div>
            <div className="text-xl font-semibold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Doanh thu theo tháng (giả lập)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Top sản phẩm bán chạy</h3>
        <ul className="space-y-2">
          {topProducts.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <span>{p.name}</span>
              <span className="text-gray-600 text-sm">Đã bán: {p.sold}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}