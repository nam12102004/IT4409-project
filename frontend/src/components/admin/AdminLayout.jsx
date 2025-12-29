import React from 'react';
import { ShieldCheck, BarChart3, ShoppingBag, Package, MessagesSquare, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export const AdminLayout = ({ onLogout }) => {
  const handleLogoutClick = () => {
    if (onLogout) onLogout();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl flex items-center gap-2"><ShieldCheck/> Admin</div>
        <nav className="flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `w-full block text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${
                isActive ? 'bg-slate-800 text-blue-400' : ''
              }`
            }
          >
            <BarChart3 size={20}/> Tổng quan
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `w-full block text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${
                isActive ? 'bg-slate-800 text-blue-400' : ''
              }`
            }
          >
            <ShoppingBag size={20}/> Đơn hàng
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `w-full block text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${
                isActive ? 'bg-slate-800 text-blue-400' : ''
              }`
            }
          >
            <Package size={20}/> Sản phẩm
          </NavLink>
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `w-full block text-left px-6 py-3 hover:bg-slate-800 flex gap-3 ${
                isActive ? 'bg-slate-800 text-blue-400' : ''
              }`
            }
          >
            <MessagesSquare size={20}/> Chat khách hàng
          </NavLink>
        </nav>
        <button onClick={handleLogoutClick} className="p-6 hover:text-red-400 flex gap-2 text-left">
          <LogOut size={20}/> Về trang chủ
        </button>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <span className="font-semibold text-gray-500">Trang quản trị</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
