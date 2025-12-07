import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Users, BarChart3, LogOut, Search, 
  ShoppingBag, Clock, CheckCircle, Truck, 
  Eye, Menu, Lock, ShieldCheck, Plus, RefreshCw
} from 'lucide-react';

//mock data cho admin
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
    items: [{ name: 'MacBook Air M1', price: 18000000, quantity: 1 }, { name: 'Màn hình Dell', price: 14000000, quantity: 1 }]
  },
  {
    id: 'DH-7823', customer: 'Lê Văn C', email: 'levanc@gmail.com',
    phone: '0912345678', address: '789 CMT8',
    date: '2023-10-23', total: 5000000, status: 'delivered',
    items: [{ name: 'Tai nghe Sony', price: 5000000, quantity: 1 }]
  },
];

const formatPriceAdmin = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'shipping': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// mock products in case backend endpoint not available
const MOCK_PRODUCTS = [
  { _id: 'p1', name: 'Laptop Asus ROG', price: 15490000, stock: 5, category: 'laptop' },
  { _id: 'p2', name: 'MacBook Air M1', price: 18000000, stock: 3, category: 'laptop' },
  { _id: 'p3', name: 'Tai nghe Sony', price: 5000000, stock: 12, category: 'accessory' },
];

//Xu ly login admin
const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // đăng nhập bằng backend để nhận token JWT
      const res = await axios.post('http://localhost:5000/api/login', { username: 'admin', password });
      const user = res?.data?.user;
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('authChanged'));
        onLogin();
      } else {
        setError('Không nhận được token từ server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Sai mật khẩu!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-slate-800 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-white"><Lock size={32} /></div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Nhập mật khẩu..." />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700">Đăng nhập</button>
        </form>
        <button onClick={() => navigate('/')} className="w-full mt-4 text-gray-500 text-sm hover:underline">← Về trang chủ</button>
      </div>
    </div>
  );
};

//Chi tiet
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">Đơn hàng #{order.id}</h3>
          <button onClick={onClose}><LogOut className="rotate-180" size={20}/></button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold flex items-center gap-2 mb-3"><Users size={18}/> Khách hàng</h4>
            <div className="text-sm space-y-1 text-gray-600">
              <p>{order.customer}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-2 mb-3"><Package size={18}/> Sản phẩm</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                  <span className="font-medium">{formatPriceAdmin(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-red-600 pt-2 text-lg">
                <span>Tổng:</span>
                <span>{formatPriceAdmin(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

//Danh sach don hang chi admin thay
const AdminOrders = () => {
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
                <td className="p-3"><div>{order.customer}</div><div className="text-xs text-gray-500">{order.phone}</div></td>
                <td className="p-3">{formatPriceAdmin(order.total)}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>{order.status}</span></td>
                <td className="p-3">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:bg-blue-100 p-2 rounded"><Eye size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

// Danh sach san pham cho admin
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '', description: '' });
  const [files, setFiles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data || []);
    } catch (err) {
      setError('Không lấy được sản phẩm từ server, hiển thị dữ liệu mẫu.');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.warn('Could not load categories', err?.message || err);
      }
    };
    fetchCategories();
  }, []);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onFilesChange = (e) => setFiles(Array.from(e.target.files || []));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.price) {
      setFormError('Tên và giá là bắt buộc');
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('stock', form.stock || 0);
      fd.append('category', form.category || '');
      fd.append('description', form.description || '');
      files.slice(0, 6).forEach((file) => fd.append('images', file));

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('Creating product, fields:', { name: form.name, price: form.price, stock: form.stock, category: form.category });
      console.log('Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

      // sử dụng POST để tạo mới, PUT để cập nhật
      let res;
      if (!editingId) {
        const url = 'http://localhost:5000/api/products';
        res = await axios.post(url, fd, { headers });
      } else {
        const url = `http://localhost:5000/api/products/${editingId}`;
        res = await axios.put(url, fd, { headers });
      }
      console.log('Create product response:', res?.status, res?.data);
    
      setShowAdd(false);
      setEditingId(null);
      setForm({ name: '', price: '', stock: '', category: '', description: '' });
      setFiles([]);
      fetchProducts();
    } catch (err) {
      console.error('Create product failed', err?.response?.data || err.message);
      setFormError(err?.response?.data?.message || 'Lỗi tạo sản phẩm');
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      category: (product.category && product.category._id) ? product.category._id : (product.category || ''),
      description: product.description || '',
    });
    setFiles([]);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const url = `http://localhost:5000/api/products/${id}`;
      const res = await axios.delete(url, { headers });
      console.log('Delete response', res?.data);
      fetchProducts();
    } catch (err) {
      console.error('Delete failed', err?.response?.data || err.message);
      alert('Xóa sản phẩm thất bại');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(true)} aria-label="Thêm sản phẩm" className="p-2 bg-green-600 text-white rounded hover:bg-green-500">
            <Plus size={16} />
          </button>
          <button onClick={fetchProducts} aria-label="Làm mới" className="p-2 border rounded hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-yellow-600 mb-3">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Kho</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Đang tải...</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{p._id}</td>
                  <td className="p-3">
                    {(
                      p.image || p.images?.[0] || p.thumbnail || p.img
                    ) ? (
                      <img src={p.image || p.images?.[0] || p.thumbnail || p.img} alt={p.name} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{formatPriceAdmin(p.price)}</td>
                  <td className="p-3">{p.stock ?? '-'}</td>
                  <td className="p-3">
                    {(
                    
                      p?.category?.name ||
                      (categories.find(c => c._id === (typeof p.category === 'string' ? p.category : p.category?._id)) || {}).name ||
                      '-'
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEditClick(p)} aria-label="Sửa" className="text-yellow-600 hover:bg-yellow-100 p-2 rounded">Sửa</button>
                    <button onClick={() => handleDelete(p._id)} aria-label="Xóa" className="text-red-600 hover:bg-red-100 p-2 rounded">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* bảng thêm/sửa sản phẩm */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
              <button onClick={() => { setShowAdd(false); setFormError(''); }} className="text-gray-500">Đóng</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required name="name" value={form.name} onChange={onChange} placeholder="Tên sản phẩm" className="border p-2 rounded" />
                <input required name="price" value={form.price} onChange={onChange} placeholder="Giá (VND)" type="number" className="border p-2 rounded" />
                <input name="stock" value={form.stock} onChange={onChange} placeholder="Tồn kho" type="number" className="border p-2 rounded" />
                <select name="category" value={form.category} onChange={onChange} className="border p-2 rounded">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Mô tả" className="w-full border p-2 rounded" />
              <div>
                <label className="text-sm">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" multiple onChange={onFilesChange} className="mt-2" />
              </div>
              {formError && <div className="text-sm text-red-600">{formError}</div>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowAdd(false); setFormError(''); }} className="px-4 py-2 border rounded">Hủy</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">{creating ? 'Đang gửi...' : 'Tạo sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

//Dashboard Admin
const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState('orders');
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl flex items-center gap-2"><ShieldCheck/> Admin</div>
        <nav className="flex-1">
          <button onClick={() => setTab('dashboard')} className={`w-full text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${tab==='dashboard'?'bg-slate-800 text-blue-400':''}`}><BarChart3 size={20}/> Tổng quan</button>
          <button onClick={() => setTab('orders')} className={`w-full text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${tab==='orders'?'bg-slate-800 text-blue-400':''}`}><ShoppingBag size={20}/> Đơn hàng</button>
          <button onClick={() => setTab('products')} className={`w-full text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${tab==='products'?'bg-slate-800 text-blue-400':''}`}><Package size={20}/> Sản phẩm</button>
        </nav>
        <button onClick={() => {onLogout(); navigate('/')}} className="p-6 hover:text-red-400 flex gap-2"><LogOut size={20}/> Về trang chủ</button>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <span className="font-semibold text-gray-500">Trang quản trị</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {tab === 'orders' && <AdminOrders />}
          {tab === 'products' && <AdminProducts />}
          {tab === 'dashboard' && <div className="text-center text-gray-500 mt-20">Biểu đồ thống kê đang cập nhật...</div>}
        </div>
      </main>
    </div>
  );
};

export default function AdminPortal() {
  const [isAuth, setIsAuth] = useState(false);
  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />;
  return <AdminDashboard onLogout={() => setIsAuth(false)} />;
}