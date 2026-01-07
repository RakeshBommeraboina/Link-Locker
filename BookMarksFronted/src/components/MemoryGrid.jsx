// src/components/MemoryGrid.jsx
import MemoryCard from "./MemoryCard";
import { deleteMemory } from "../api/memoryapi";

export default function MemoryGrid({ memories, loading, onDelete }) {
  if (loading) return <p>Loading memories...</p>;
  if (!loading && memories.length === 0) return <p>No memories found.</p>;
    


  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memories.map((memory) => (
        <MemoryCard key={memory._id} memory={memory} onDelete={onDelete} />
      ))}
    </div>
  );
}
