import videofile from "../Models/videofile.js";
import User from "../Models/Auth.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "Please upload an .mp4 video file only" });
  }
  try {
    const file = new videofile({
      videotitle: req.body.title,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.chanel,
      uploader: req.body.uploader,
    });
    console.log(file);
    await file.save();
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getallvideos = async (req, res) => {
  try {
    const files = await videofile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletevideo = async (req, res) => {
  try {
    const deletedVideo = await videofile.findByIdAndDelete(req.params.id);
    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePoints = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.videosWatched = (user.videosWatched || 0) + 1;
    user.points = (user.points || 0) + 5; // ✅ increment instead of overwrite

    await user.save();

    res.status(200).json({ message: "Points updated", points: user.points });
  } catch (err) {
    console.error("❌ Error updating points:", err.message);
    res.status(500).json({ error: "Failed to update points" });
  }
};
