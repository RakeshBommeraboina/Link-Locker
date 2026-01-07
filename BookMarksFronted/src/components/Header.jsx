import { useState, useEffect, useRef } from "react";
import { FiSearch, FiLogOut } from "react-icons/fi";
import api from "../api/axiosInstance";

export default function Header({ title, filter, onSearch, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left */}
        <h1 className="text-2xl font-semibold text-gray-800">
          {title}
        </h1>

        {/* 🔍 Search (ONLY in All) */}
        {filter === "all" && (
          <div className="hidden md:block flex-1 max-w-md mx-6 relative">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="AI search memories..."
              className="
                w-full pl-11 pr-4 py-2.5
                bg-gray-100
                rounded-full
                text-sm
                focus:outline-none
                focus:ring-2 focus:ring-indigo-400
              "
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  onSearch(e.target.value.trim());
                }
              }}
            />
          </div>
        )}

        {/* Right Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-full transition"
          >
            <img
              src={user.avatar || `https://i.pravatar.cc/40?u=${user._id}`}
              alt="Profile"
              className="w-9 h-9 rounded-full"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              
              <div className="p-4 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="p-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
