import express from "express";
import { login } from "../Controllers/Auth.js";
import { updatechaneldata, getallchanels } from "../Controllers/channel.js";
import { getUserProfile } from "../Controllers/user.js"; // ✅ added
import User from "../Models/Auth.js"; // ✅ added
import { createOrder, verifyPayment } from "../Controllers/payment.js"; 

import { verifyOTP } from "../Controllers/user.js";

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updatechaneldata);
routes.get("/getallchannel", getallchanels);
routes.get("/profile/:id", getUserProfile);

routes.post("/verify-otp", verifyOTP);



routes.post("/payment/order", createOrder);
routes.post("/payment/verify", verifyPayment);




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
