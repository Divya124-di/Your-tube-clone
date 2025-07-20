import fs from "fs";
import path from "path";
import User from "../Models/Auth.js"; // Assuming your user schema is here
import Videofile from "../Models/videofile.js";

export const downloadVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const video = await Videofile.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const today = new Date().toISOString().slice(0, 10); // Format: "YYYY-MM-DD"
    const lastDownloadDate = user.lastDownloadDate?.toISOString().slice(0, 10);
    const isSameDay = today === lastDownloadDate;

    if (!user.isPremium) {
      if (isSameDay && user.downloadedToday?.length >= 1) {
        return res
          .status(403)
          .json({ message: "Free download limit reached for today." });
      }
    }

    // ✅ Prepare updated fields
    const updatedFields = {
      lastDownloadDate: new Date(),
      downloadedToday: isSameDay
        ? [...(user.downloadedToday || []), videoId]
        : [videoId],
    };

    await User.findByIdAndUpdate(userId, { $set: updatedFields });

    // ✅ Serve the video file
    const filepath = path.resolve("uploads", path.basename(video.filepath));

    // Optional: check if file exists
    if (!fs.existsSync(filepath)) {
      return res
        .status(404)
        .json({ message: "Video file not found on server" });
    }
    console.log("📁 Serving file:", filepath);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${video.filename}"`
    );
    res.setHeader("Content-Type", "video/mp4"); // or determine type dynamically

    res.download(filepath, video.filename); // Triggers download in browser
  } catch (error) {
    console.error("❌ Download error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
