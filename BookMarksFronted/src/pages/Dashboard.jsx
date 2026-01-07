// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MemoryGrid from "../components/MemoryGrid";
import {
  getAllMemories,
  deleteMemory,
  searchMemories, // ✅ MISSING IMPORT FIXED
} from "../api/memoryapi";

export default function Dashboard({ onLogout }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Load all memories
  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      const data = await getAllMemories();
      setMemories(data);
      setLoading(false);
    };
    fetchMemories();
  }, []);

  // Delete memory
  const handleDelete = async (id) => {
    await deleteMemory(id);
    setMemories((prev) => prev.filter((m) => m._id !== id));
  };

  // 🔍 AI Search (All category only)
  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const res = await searchMemories(query);
      setMemories(res.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories =
    filter === "all"
      ? memories
      : memories.filter((m) => m.type === filter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-30">
        <Sidebar filter={filter} setFilter={setFilter} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-64">
        
        {/* Header */}
        <div className="sticky top-0 z-20">
          <Header
            title={
              filter === "all"
                ? "All Memories"
                : filter.charAt(0).toUpperCase() + filter.slice(1)
            }
            filter={filter}          // ✅ REQUIRED
            onSearch={handleSearch}  // ✅ REQUIRED
            onLogout={onLogout}
          />
        </div>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <MemoryGrid
            memories={filteredMemories}
            loading={loading}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}
