import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import { formatPriceAdmin, getStatusColor } from './utils';

const MOCK_ORDERS = [
  {
    id: 'DH-7821', customer: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com',
    phone: '0909123456', address: '123 Đường Lê Lợi, Q.1, TP.HCM',
    date: '2023-10-25', total: 15490000, status: 'pending',
    items: [{ name: 'Laptop Gaming Asus ROG', price: 15490000, quantity: 1 }]
  },
  {
    id: 'DH-7822', customer: 'Trần Thị B', email: 'tranthib@gmail.com',
    phone: '0912345678', address: '456 Đường Nguyễn Huệ, Q.1, TP.HCM',
    date: '2023-10-24', total: 32000000, status: 'shipping',
    items: [
      { name: 'MacBook Air M1', price: 18000000, quantity: 1 },
      { name: 'Màn hình Dell', price: 14000000, quantity: 1 }
    ]
  },
  {
    id: 'DH-7823', customer: 'Lê Văn C', email: 'levanc@gmail.com',
    phone: '0912345678', address: '789 CMT8',
    date: '2023-10-23', total: 5000000, status: 'delivered',
    items: [{ name: 'Tai nghe Sony', price: 5000000, quantity: 1 }]
  },
];

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = MOCK_ORDERS.filter(o => filter === 'all' || o.status === filter);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Danh sách đơn hàng</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xử lý</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Hoàn thành</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr><th className="p-3">Mã</th><th className="p-3">Khách</th><th className="p-3">Tổng tiền</th><th className="p-3">Trạng thái</th><th className="p-3">Thao tác</th></tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-blue-600">{order.id}</td>
                <td className="p-3">
                  <div>{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                </td>
                <td className="p-3">{formatPriceAdmin(order.total)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:bg-blue-100 p-2 rounded">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default AdminOrders;
