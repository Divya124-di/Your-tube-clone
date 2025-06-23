import express from "express";
import { login } from "../Controllers/Auth.js";
import { updatechaneldata, getallchanels } from "../Controllers/channel.js";
import User from "../Models/Auth.js"; // ✅ added

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updatechaneldata);
routes.get("/getallchannel", getallchanels);



routes.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ points: user.points });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default routes;
