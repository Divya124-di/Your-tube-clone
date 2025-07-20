import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  desc: { type: String },
  joinedon: { type: Date, default: Date.now },

  // 👇 Task 1: Video Points
  videosWatched: { type: Number, default: 0 },
  points: { type: Number, default: 0 },

  // ✅ Task 2: Premium Features
  isPremium: { type: Boolean, default: false },
  downloadedToday: { type: [String], default: [] }, // video IDs
  lastDownloadDate: { type: Date, default: null },
  downloads: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: "videofile" },
      downloadedAt: { type: Date, default: Date.now },
    },
  ],

  // ✅ Task 3: Location, Theme, OTP
  state: { type: String, default: "Unknown" }, // e.g., Bihar, Tamil Nadu
  theme: { type: String, enum: ["light", "dark"], default: "dark" },
  otp: { type: Number }, // 6-digit OTP
  phone: { type: String, default: "" }, // required for SMS OTP
});

export default mongoose.model("User", userschema);
