import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: { type: String, default: "product" },
  url: String,
  title: String,
  price: String,
  description: String,
  rating: String,
  timestamp: Number,
  raw: Object,
});

const ProductMemory = mongoose.model("ProductMemory", productSchema);
export default ProductMemory;
