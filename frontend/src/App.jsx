import React, { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext.jsx'; 
import { 
  Package, Users, BarChart3, LogOut, Search, 
  ShoppingBag, Clock, CheckCircle, Truck, 
  Eye, Menu, Lock, ShieldCheck
} from 'lucide-react';


import Header from './header.jsx'; 
import WelcomeBanner from './WelcomeBanner.jsx'; 
import { CategoryList } from './IconDanhMuc.jsx'; 
import { ProductGrid } from './ProductGrid.jsx';
import { ProductModal } from './ProductModal.jsx';
import { TrangThanhToan } from './TrangThanhToan.jsx'; 

//mock data cho admin (sau phai lay tu SQL backend)
const MOCK_ORDERS = [
  {
    id: 'DH-7821',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0909123456',
    address: '123 Đường Lê Lợi, Q.1, TP.HCM',
    date: '2023-10-25',
    total: 15490000,
    status: 'pending', 
    items: [{ name: 'Laptop Gaming Asus ROG', price: 15490000, quantity: 1 }]
  },
  {
    id: 'DH-7822',
    customer: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912345678',
    address: '456 Đường Nguyễn Huệ, Q.1, TP.HCM',
    date: '2023-10-24',
    total: 32000000,
    status: 'shipping',
    items: [
      { name: 'MacBook Air M1', price: 18000000, quantity: 1 },
      { name: 'Màn hình Dell UltraSharp', price: 14000000, quantity: 1 }
    ]
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

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'shipping': return 'Đang giao';
    case 'delivered': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

//man hinh dang nhap admin (chua co trang admin khac)
const AdminLogin = ({ onLogin, onBackToShop }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') { 
      onLogin();
    } else {
      setError('Mật khẩu sai! Bạn là 1 hacker có phải không!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 z-50 relative font-sans">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-slate-800 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-white">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors">
            Đăng nhập
          </button>
        </form>
        <button onClick={onBackToShop} className="w-full mt-4 text-gray-500 text-sm hover:text-gray-800">
          ← Quay lại trang bán hàng
        </button>
      </motion.div>
    </div>
  );
};

//Chi tiet don hang (admin moi duoc xem)
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

//Danh sach don hang
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
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-blue-600">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{formatPriceAdmin(order.total)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline">
                    <Eye size={18}/>
                  </button>
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

//Dang nhap/Dang xuat admin
const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState('orders');

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl flex items-center gap-2"><ShieldCheck/> Admin</div>
        <nav className="flex-1">
          <button onClick={() => setTab('dashboard')} className={`w-full text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${tab==='dashboard'?'bg-slate-800 text-blue-400':''}`}><BarChart3 size={20}/> Tổng quan</button>
          <button onClick={() => setTab('orders')} className={`w-full text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${tab==='orders'?'bg-slate-800 text-blue-400':''}`}><ShoppingBag size={20}/> Đơn hàng</button>
        </nav>
        <button onClick={onLogout} className="p-6 hover:text-red-400 flex gap-2"><LogOut size={20}/> Đăng xuất</button>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <span className="font-semibold text-gray-500">Trang quản trị</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {tab === 'orders' && <AdminOrders />}
          {tab === 'dashboard' && <div className="text-center text-gray-500 mt-20">Biểu đồ thống kê đang cập nhật...</div>}
        </div>
      </main>
    </div>
  );
};


function App() {
  
  const { isCheckoutOpen } = useCart(); 
  const [selectedCategory, setSelectedCategory] = useState('laptop');
  const [selectedProduct, setSelectedProduct] = useState(null);

  //cac che do cua admin
  const [viewMode, setViewMode] = useState('client'); 
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  //logic chuyen sang dashboard cua admin
  const handleGoToAdmin = () => {
    if (isAdminAuth) setViewMode('admin-dashboard');
    else setViewMode('admin-login');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    setViewMode('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setViewMode('client');
  };


  if (viewMode === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLoginSuccess} onBackToShop={() => setViewMode('client')} />;
  }

  
  if (viewMode === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

 
  return (
    <div className="App bg-gray-50 min-h-screen relative">
      
      
      <button 
        onClick={handleGoToAdmin}
        className="fixed bottom-5 right-5 z-40 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 hover:scale-110 transition-all flex items-center gap-2 group cursor-pointer border-2 border-white"
        title="Truy cập trang quản trị"
      >
        <ShieldCheck size={24} />
        
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold pl-0 group-hover:pl-2">
          Admin
        </span>
      </button>

      
      <Header />
      <WelcomeBanner />
      
      <CategoryList 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductGrid 
        category={selectedCategory}
        onCardClick={setSelectedProduct}
      />
      
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            key={selectedProduct.id}
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && <TrangThanhToan />}
      </AnimatePresence>
    </div>
  );
}

export default App;