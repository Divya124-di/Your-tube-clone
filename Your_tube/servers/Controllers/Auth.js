import users from "../Models/Auth.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendEmailOTP } from "../utils/sendEmailOtp.js";
import { sendMobileOTP } from "../utils/sendMobileOtp.js";
import OtpModel from "../Models/otp.js";

export const login = async (req, res) => {
  const { email, pincode, phone } = req.body;

  console.log("👉 Received login request:");
  console.log("📧 Email:", email);
  console.log("📮 Pincode:", pincode);
  console.log("📱 Phone:", phone);

  const southStates = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
  ];

  if (!email || !pincode) {
    return res.status(400).json({ message: "Email and pincode are required" });
  }

  try {
    // ✅ 1. Get state from pincode
    const locationRes = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const state = locationRes?.data?.[0]?.PostOffice?.[0]?.State || "Unknown";
    const isSouthernState = southStates.includes(state);

    // ✅ 2. Check login time
    const currentHour = new Date().getHours();
    const isTimeBetween10And12 = currentHour >= 10 && currentHour < 12;

    // ✅ 3. Apply BOTH conditions for light theme and SMS OTP
    const allowSMSOTP = isSouthernState && isTimeBetween10And12;
    const theme = allowSMSOTP ? "light" : "dark";

    // ✅ 4. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ 5. Check/create user
    let user = await users.findOne({ email });
    if (!user) {
      user = await users.create({
        email,
        phone: phone || "NA",
        state,
        theme,
      });
    } else {
      user.state = state;
      user.theme = theme;
      if (!user.phone && phone) user.phone = phone;
      await user.save();
    }

    // ✅ 6. Send OTP (email by default, SMS if allowed)
    if (allowSMSOTP) {
      if (!phone) {
        return res
          .status(400)
          .json({ message: "Phone number required for OTP via SMS" });
      }
      await sendMobileOTP(phone, otp);
      console.log(`✅ SMS OTP sent to ${phone}`);
    } else {
      await sendEmailOTP(email, otp);
      console.log(`✅ Email OTP sent to ${email}`);
    }

    // ✅ 7. Store OTP
    await OtpModel.findOneAndUpdate(
      allowSMSOTP ? { phone } : { email },
      { email, phone, otp },
      { upsert: true, new: true }
    );

    // ✅ 8. Create token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECERT,
      { expiresIn: "1h" }
    );

    // ✅ 9. Respond
    res.status(200).json({
      result: user,
      token,
      theme,
      otpMethod: allowSMSOTP ? "sms" : "email",
      message: `OTP sent via ${allowSMSOTP ? "SMS" : "Email"} to ${
        allowSMSOTP ? phone : email
      }`,
    });

    console.log("✔️ Login request handled successfully");
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Something went wrong..." });
  }
};
