import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/register", { username: form.username, password: form.password });
      const user = res.data.user;
      const token = res.data.token;
      if (user && token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('authChanged'));
        navigate('/');
        return;
      }
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="username" required placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <input name="password" type="password" required placeholder="Mật khẩu" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          <button disabled={loading} className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700">{loading ? "Đang đăng ký..." : "Đăng ký"}</button>
        </form>
      </div>
    </div>
  );
}
