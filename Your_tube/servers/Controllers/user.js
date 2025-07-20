// controllers/user.js
import User from "../Models/Auth.js";
import OtpModel from "../Models/otp.js"; // Ensure correct import path

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("downloadedToday", "videotitle _id") // only fetch needed fields
      .lean(); // optional: makes response plain JS object

    if (!user) return res.status(404).json({ message: "User not found" });

    // Customize the response structure
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points || 0,
      joinedon: user.joinedon,
      downloads: user.downloadedToday || [],
    };

    res.status(200).json(userProfile);
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Route: POST /user/verify-otp
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OtpModel.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // ✅ Success — delete OTP and return success
    await OtpModel.deleteOne({ email });
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Something went wrong during OTP check." });
  }
};

