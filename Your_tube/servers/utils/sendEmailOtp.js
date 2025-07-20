import nodemailer from "nodemailer";

export const sendEmailOTP = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ e.g. "youremail@gmail.com"
        pass: process.env.EMAIL_PASS, // ✅ e.g. your App Password  
      },
    });

    const mailOptions = { 
      from: `"Your-Tube OTP" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    };
    console.log("✅ Transporter initialized with:", process.env.EMAIL_USER);

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent successfully to:", toEmail);
  } catch (error) {
    console.error("❌ Email OTP sending failed:", error.message);  
  }
};

// import nodemailer from "nodemailer";

// export const sendEmailOTP = async (toEmail, otp) => {
//   // ✅ Create test account
//   const testAccount = await nodemailer.createTestAccount();

//   // ✅ Create transporter using Ethereal test SMTP
//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   // ✅ Email details
//   const mailOptions = {
//     from: '"Your-Tube OTP" <no-reply@yourtube.com>',
//     to: toEmail,
//     subject: "Your OTP Code",
//     text: `Your OTP is: ${otp}`,
//   };

//   // ✅ Send mail
//   const info = await transporter.sendMail(mailOptions);

//   console.log("✅ Email OTP sent (Ethereal)");
//   console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));
// };

