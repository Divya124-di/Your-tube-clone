import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  desc: { type: String },
  joinedon: { type: Date, default: Date.now },

  // 👇 Task 1 fields
  videosWatched: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

export default mongoose.model("User", userschema);
