// src/components/Sidebar.jsx
import {
  FiHome,
  FiBook,
  FiShoppingCart,
  FiVideo,
} from "react-icons/fi";

export default function Sidebar({ filter, setFilter }) {
  const navItems = [
    { label: "All Memories", type: "all", icon: FiHome },
    { label: "Articles", type: "article", icon: FiBook },
    { label: "Products", type: "product", icon: FiShoppingCart },
    { label: "Videos", type: "video", icon: FiVideo },
  ];

  return (
    <aside className="
      h-screen w-64
      bg-white
      border-r border-gray-200
      flex flex-col
    ">
      {/* Logo / Brand */}
      <div className="px-6 py-6 ">
        <h1 className="text-xl font-semibold text-gray-800">
          🔗 Link Locker
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Your captured knowledge
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = filter === item.type;

          return (
            <button
              key={item.type}
              onClick={() => setFilter(item.type)}
              className={`
                w-full flex items-center gap-3
                px-4 py-2.5 rounded-xl
                text-sm font-medium
                transition
                ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <Icon
                className={`text-lg ${
                  active ? "text-indigo-500" : "text-gray-400"
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

     

      
    </aside>
  );
}
