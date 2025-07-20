import axios from "axios";

export const sendMobileOTP = async (phone, otp) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/${otp}/OTP1`
    );
    console.log("✅ 2Factor OTP SMS Response:", response.data);
  } catch (err) {
    console.error("❌ Failed to send OTP via 2Factor:", err.response?.data || err.message);
    throw new Error("OTP sending failed");
  }
};



// import axios from "axios";

// export const sendMobileOTP = async (phone) => {
//   const apiKey = process.env.TWOFACTOR_APIKEY;
//   const url = `https://2factor.in/API/V1/${apiKey}/SMS/91${phone}/AUTOGEN`;

//   const { data } = await axios.get(url);
//   if (data.Status !== "Success") {
//     throw new Error("SMS OTP failed: " + data.Details || data.Status);
//   }
//   return data.Details; // session id
// };
// export const verifyMobileOTP = async (phone, sessionId, otp) => {
//   const apiKey = process.env.TWOFACTOR_APIKEY;
//   const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`;

//   const { data } = await axios.get(url);
//   if (data.Status !== "Success") {
//     throw new Error("OTP verification failed: " + data.Details || data.Status);
//   }
//   return data.Details; // success message
//};
// Usage example:
// (async () => {
//   try {
//     const sessionId = await sendMobileOTP("1234567890");
//     console.log("Session ID:", sessionId);
//     const verificationResult = await verifyMobileOTP("1234567890", sessionId, "1234");
//     console.log("Verification Result:", verificationResult);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// })();
