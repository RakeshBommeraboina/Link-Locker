import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: { type: String, default: "video" },
  url: String,
  title: String,
  channelName: String,
  description: String,
  duration: String,
  timestamp: Number,
  raw: Object,
});

const VideoMemory = mongoose.model("VideoMemory", videoSchema);
export default VideoMemory;
