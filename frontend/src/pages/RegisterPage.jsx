import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!captchaToken) {
        setError("Vui lòng xác nhận captcha");
        setLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Mật khẩu và xác nhận mật khẩu không khớp.");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/register", {
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        fullname: form.fullname,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        captchaToken,
      });
      const user = res.data.user;
      const token = res.data.token;

    
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        return;
      }


      if (res.data.email) {
        setVerifyEmail(res.data.email);
        setVerifyModalOpen(true);
        return;
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setVerifyLoading(true);

    try {
      if (!verifyEmail || !verifyCode) {
        setVerifyError("Vui lòng nhập đầy đủ email và mã xác thực.");
        setVerifyLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/verify-email", {
        email: verifyEmail,
        code: verifyCode,
      });

      const user = res.data.user;
      const token = res.data.token;
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        setVerifyModalOpen(false);
        navigate("/");
        return;
      }

      setVerifyError(res.data.message || "Xác thực thành công nhưng không nhận được thông tin tài khoản.");
    } catch (err) {
      setVerifyError(
        err?.response?.data?.message || "Xác thực email thất bại. Vui lòng thử lại."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Đăng ký tài khoản"
        description="Tạo tài khoản Tech-Geeks để nhận ưu đãi và theo dõi đơn hàng."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullname"
            required
            placeholder="Họ và tên"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="username"
            required
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="phoneNumber"
            required
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="address"
            required
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={setCaptchaToken}
          />
          <button
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>

      {verifyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Xác thực email
            </h3>
            {verifyEmail && (
              <p className="text-sm text-gray-600 mb-2">
                Mã xác thực 8 ký tự đã được gửi tới: <strong>{verifyEmail}</strong>
              </p>
            )}
            {verifyError && (
              <div className="text-red-600 mb-3 text-sm">{verifyError}</div>
            )}
            <form onSubmit={handleVerifySubmit} className="space-y-3">
              {!verifyEmail && (
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={verifyEmail}
                  onChange={(e) => setVerifyEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              )}
              <input
                type="text"
                required
                maxLength={8}
                placeholder="Mã xác thực 8 ký tự"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded tracking-[0.3em] text-center"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  {verifyLoading ? "Đang xác thực..." : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
