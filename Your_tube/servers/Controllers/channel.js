import mongoose from "mongoose";
import User from "../Models/Auth.js"; // ✅ Correct model name

// ✅ PATCH: /user/update/:id
export const updatechaneldata = async (req, res) => {
  const { id: _id } = req.params;
  const { name, desc } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { name, desc } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ GET: /user/getallchannel
export const getallchanels = async (req, res) => {
  try {
    const allchannels = await User.find();
    const allchaneldata = allchannels.map((channel) => ({
      _id: channel._id,
      name: channel.name,
      email: channel.email,
      desc: channel.desc,
    }));

    res.status(200).json(allchaneldata);
  } catch (error) {
    console.error("❌ Get All Channels Error:", error);
    res.status(500).json({ message: error.message });
  }
};
