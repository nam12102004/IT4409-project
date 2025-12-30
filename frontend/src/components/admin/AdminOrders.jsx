import React, { useState, useEffect, useMemo } from 'react';
import { Eye, PackageSearch, Clock3, Truck, CheckCircle2, RotateCcw } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import { formatPriceAdmin, getStatusColor, formatStatusLabel } from './utils';
import axios from 'axios';

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập với vai trò admin để xem đơn hàng.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverOrders = Array.isArray(res?.data?.orders) ? res.data.orders : [];
        const mapped = serverOrders.map((o) => ({
          id: o._id,
          customer: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          address: o.shippingAddress,
          date: o.createdAt?.slice(0, 10) ?? '',
          total: o.totalPrice,
          status: o.orderStatus,
          items: Array.isArray(o.items)
            ? o.items.map((it, idx) => ({
                name: it.productName,
                price: it.price,
                quantity: it.quantity,
                id: it.productId || idx,
              }))
            : [],
        }));
        setOrders(mapped);
      } catch (err) {
        setError(err?.response?.data?.message || 'Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);

  // Thống kê số lượng theo trạng thái để hiển thị thẻ giống giao diện mẫu
  const stats = useMemo(() => {
    const total = orders.length;
    let pending = 0;
    let shipping = 0;
    let delivered = 0;
    let returned = 0;

    orders.forEach((o) => {
      const s = o.status;
      if (s === 'pending' || s === 'waiting_for_payment') pending += 1;
      else if (s === 'shipping' || s === 'confirmed') shipping += 1;
      else if (s === 'delivered') delivered += 1;
      else if (s === 'cancelled' || s === 'refunded') returned += 1;
    });

    return { total, pending, shipping, delivered, returned };
  }, [orders]);

  const handleLocalStatusChange = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-500">
            Theo dõi trạng thái đơn và xử lý yêu cầu của khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-gray-500">
            <PackageSearch size={16} />
            <span>Tổng đơn:</span>
          </span>
          <span className="font-semibold">{stats.total}</span>
        </div>
      </div>

      {/* Hàng thẻ thống kê giống giao diện mẫu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1 border border-gray-100">
          <span className="text-xs text-gray-500">Tổng đơn</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{stats.total}</span>
            <span className="text-2xl">📦</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1 border border-gray-100">
          <span className="text-xs text-gray-500">Chờ duyệt</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{stats.pending}</span>
            <Clock3 className="text-amber-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1 border border-gray-100">
          <span className="text-xs text-gray-500">Đang giao</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{stats.shipping}</span>
            <Truck className="text-sky-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1 border border-gray-100">
          <span className="text-xs text-gray-500">Đã giao</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{stats.delivered}</span>
            <CheckCircle2 className="text-emerald-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col gap-1 border border-gray-100">
          <span className="text-xs text-gray-500">Hoàn trả / Hủy</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{stats.returned}</span>
            <RotateCcw className="text-rose-500" size={22} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold">Danh sách đơn hàng</h3>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 mr-1">Lọc theo trạng thái:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm"
            >
              <option value="all">Tất cả</option>
              <option value="waiting_for_payment">Chờ thanh toán</option>
              <option value="pending">Chờ duyệt</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading && <div className="p-3 text-sm text-gray-500">Đang tải đơn hàng...</div>}
          {error && <div className="p-3 text-sm text-red-600">{error}</div>}

          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-y">
              <tr>
                <th className="p-3 font-medium text-gray-600">Mã đơn</th>
                <th className="p-3 font-medium text-gray-600">Khách hàng</th>
                <th className="p-3 font-medium text-gray-600">Tổng tiền</th>
                <th className="p-3 font-medium text-gray-600">Trạng thái</th>
                <th className="p-3 font-medium text-gray-600 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 align-top">
                    <button
                      className="text-blue-600 hover:underline font-semibold text-xs md:text-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      #{order.id?.slice(-6) || order.id}
                    </button>
                  </td>
                  <td className="p-3 align-top">
                    <div className="text-sm font-medium text-gray-800">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                    <div className="text-xs text-gray-500">{order.phone}</div>
                  </td>
                  <td className="p-3 align-top font-semibold text-red-600">
                    {formatPriceAdmin(order.total)}
                  </td>
                  <td className="p-3 align-top">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {formatStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {order.status === 'pending' && (
                        <>
                          <button
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                            onClick={() => handleLocalStatusChange(order.id, 'confirmed')}
                          >
                            Duyệt
                          </button>
                          <button
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600"
                            onClick={() => handleLocalStatusChange(order.id, 'cancelled')}
                          >
                            Hủy
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-600"
                          onClick={() => handleLocalStatusChange(order.id, 'refunded')}
                        >
                          Hoàn tiền
                        </button>
                      )}
                      {(order.status === 'cancelled' || order.status === 'refunded') && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                          Đã xử lý
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={14} />
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                    Không có đơn hàng phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default AdminOrders;
