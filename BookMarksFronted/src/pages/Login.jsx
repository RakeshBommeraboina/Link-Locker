// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../api/authapi";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token } = await loginUser(email, password);
      onLogin(token);
      window.postMessage({ type: "MEMORY_AUTH_TOKEN", token }, "*");
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-slate-100 via-indigo-100 to-sky-100">

      <div className="bg-white w-96 p-10 rounded-3xl shadow-xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Sign in to continue
        </p>

        {/* Error */}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-11 pr-12 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-xl
              font-semibold hover:bg-indigo-600 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-500 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
