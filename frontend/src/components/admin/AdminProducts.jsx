import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, RefreshCw } from 'lucide-react';
import { formatPriceAdmin } from './utils';

const MOCK_PRODUCTS = [
  { _id: 'p1', name: 'Laptop Asus ROG', price: 15490000, stock: 5, category: 'laptop' },
  { _id: 'p2', name: 'MacBook Air M1', price: 18000000, stock: 3, category: 'laptop' },
  { _id: 'p3', name: 'Tai nghe Sony', price: 5000000, stock: 12, category: 'accessory' },
];

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
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

      let res;
      if (!editingId) {
        const url = 'http://localhost:5000/api/products';
        res = await axios.post(url, fd, { headers });
      } else {
        const url = `http://localhost:5000/api/products/${editingId}`;
        res = await axios.put(url, fd, { headers });
      }

      setShowAdd(false);
      setEditingId(null);
      setForm({ name: '', price: '', stock: '', category: '', description: '' });
      setFiles([]);
      fetchProducts();
    } catch (err) {
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
      await axios.delete(url, { headers });
      fetchProducts();
    } catch (err) {
      alert('Xóa sản phẩm thất bại');
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((p) => (p.name || '').toLowerCase().includes(normalizedSearch))
    : products;

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

      {/* Tìm kiếm sản phẩm theo tên trong admin */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Tìm sản phẩm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              filteredProducts.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{p._id}</td>
                  <td className="p-3">
                    {(p.image || p.images?.[0] || p.thumbnail || p.img) ? (
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
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                  {creating ? 'Đang gửi...' : 'Tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
