import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: { type: String, default: "article" },
  url: String,
  title: String,
  content: String,
  summary: String,
  author: String,
  publishedDate: String,
  timestamp: Number,
  raw: Object,
});

const ArticleMemory = mongoose.model("ArticleMemory", articleSchema);
export default ArticleMemory;
