import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../Models/Auth.js";

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_yyZtj8ZVlL2d4N",
  key_secret: "GYgWi5fow3hqP2a5vDV7hUNe",
});

// ✅ Create order
export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // e.g., 10000 = ₹100.00
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// ✅ Verify payment and update user
export const verifyPayment = async (req, res) => {
  const { userId, paymentId } = req.body;

  try {
    // You can also verify signature here (optional)
    await User.findByIdAndUpdate(userId, { isPremium: true });

    res.status(200).json({ message: "✅ User upgraded to premium" });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
