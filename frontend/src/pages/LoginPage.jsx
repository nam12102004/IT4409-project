import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import SEO from "../components/common/SEO";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        alert("Không nhận được token Google");
        return;
      }

      const res = await axios.post("https://thnm.id.vn/api/login/google", {
        idToken,
      });

      if (res.data.status === "need_profile") {
        navigate("/google-complete-profile", {
          state: {
            email: res.data.email,
            fullname: res.data.fullname || "",
            googleSignupToken: res.data.googleSignupToken,
          },
        });
        return;
      }

      const user = res.data.user;
      const token = res.data.token;
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
      } else {
        alert("Đăng nhập Google không thành công.");
      }
    } catch (err) {
      alert(
        err?.response?.data?.message || "Đăng nhập Google thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleGoogleError = () => {
    alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      const res = await axios.post("https://it4409-deploy-backend.onrender.com/api/login", {
        username,
        password,
        
      });
        const user = res.data.user;
        const token = res.data.token;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Đăng nhập"
        description="Đăng nhập vào tài khoản Tech-Geeks để trải nghiệm mua sắm tốt hơn."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Tên đăng nhập của bạn"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Mật khẩu của bạn"
            />
          </div>

         

          <button className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700">
            Đăng nhập
          </button>
        </form>
        <div className="mt-4 border-t pt-4">
          <p className="text-center text-sm text-gray-500 mb-2">
            Hoặc đăng nhập bằng
          </p>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sky-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
          <div>
            <span>Bạn chưa có tài khoản? </span>
            <Link to="/register" className="text-sky-600 hover:underline">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
