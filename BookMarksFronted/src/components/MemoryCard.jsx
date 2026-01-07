// src/components/MemoryCard.jsx
import { useState } from "react";
import { FiFileText, FiShoppingCart, FiVideo } from "react-icons/fi";

export default function MemoryCard({ memory, onDelete }) {
  const [open, setOpen] = useState(false);

  const typeColors = {
    article: "bg-blue-50 border-blue-300",
    product: "bg-green-50 border-green-300",
    video: "bg-red-50 border-red-300",
  };

  const typeIcons = {
    article: <FiFileText className="text-blue-500" />,
    product: <FiShoppingCart className="text-green-500" />,
    video: <FiVideo className="text-red-500" />,
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleDateString();
  };

  const previewContent = () => {
    switch (memory.type) {
      case "article":
        return memory.summary?.slice(0, 80) + "...";
      case "product":
        return memory.description?.slice(0, 80) + "...";
      case "video":
        return memory.description?.slice(0, 80) + "...";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Compact card */}
      <div
        onClick={() => setOpen(true)}
        className={`cursor-pointer border-l-4 p-5 rounded-2xl shadow hover:shadow-2xl transition bg-white ${typeColors[memory.type]}`}
      >
        <div className="flex items-center gap-2 mb-2">
          {typeIcons[memory.type]}
          <span className="uppercase text-sm font-semibold">
            {memory.type}
          </span>
        </div>
        <h2 className="text-lg font-bold mb-1">{memory.title}</h2>
        <p className="text-gray-600">{previewContent()}</p>
        <div className="mt-2 text-xs text-gray-400">
          {formatDate(memory.timestamp)}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4">
              {typeIcons[memory.type]}
              <span className="uppercase text-sm font-semibold">
                {memory.type}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">{memory.title}</h2>

            {/* Details */}
            <div className="space-y-3 text-gray-700">
              {memory.type === "article" && (
                <>
                  <p>{memory.summary}</p>
                  {memory.author && (
                    <p className="text-gray-500">By: {memory.author}</p>
                  )}
                  {memory.publishedDate && (
                    <p className="text-gray-400 text-sm">
                      Published: {memory.publishedDate}
                    </p>
                  )}
                </>
              )}

              {memory.type === "product" && (
                <>
                  <p>{memory.description}</p>
                  {memory.price && (
                    <p className="text-green-600 font-semibold">
                      {memory.price}
                    </p>
                  )}
                  {memory.rating && (
                    <p className="text-yellow-500">
                      Rating: {memory.rating}
                    </p>
                  )}
                </>
              )}

              {memory.type === "video" && (
                <>
                  {memory.channelName && (
                    <p className="text-gray-500">
                      Channel: {memory.channelName}
                    </p>
                  )}
                  <p>{memory.description}</p>
                  {memory.url?.includes("youtube") && (
                    <iframe
                      className="w-full h-64 rounded-xl mt-2"
                      src={memory.url.replace("watch?v=", "embed/")}
                      title={memory.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>{formatDate(memory.timestamp)}</span>
              {memory.url && (
                <a
                  href={memory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Open Original
                </a>
              )}
            </div>

            {/* Delete Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this memory?"
                    )
                  ) {
                    onDelete(memory._id);
                    setOpen(false);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
