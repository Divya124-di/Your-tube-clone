import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Profile.css";

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Profile = () => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const [points, setPoints] = useState(0);
  const [downloads, setDownloads] = useState([]);

  const handleRazorpayPayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 10000 }), // ₹100
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_yyZtj8ZVlL2d4N", // your Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "YourTube Premium",
        description: "Unlimited downloads access",
        order_id: order.id,
        handler: async function (response) {
          // ✅ VERIFY PAYMENT
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/user/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentuser?.result._id,
                  paymentId: response.razorpay_payment_id,
                }),
              }
            );

            const data = await verifyRes.json();
            if (verifyRes.ok) {
              alert("✅ Premium activated successfully!");
              window.location.reload(); // optional: to reflect new UI
            } else {
              alert("❌ Verification failed: " + data.message);
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Something went wrong during verification.");
          }
        },
        prefill: {
          name: currentuser?.result.name,
          email: currentuser?.result.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Something went wrong while creating the order");
    }
  };

  const [savedVideos, setSavedVideos] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("downloads");
    if (stored) {
      setSavedVideos(JSON.parse(stored));
    }
  }, []);

  
const handleDeleteSavedVideo = (id) => {
  const updatedVideos = savedVideos.filter((v) => v._id !== id);
  setSavedVideos(updatedVideos);
  localStorage.setItem("downloads", JSON.stringify(updatedVideos));
};
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(
          `${backendURL}/user/profile/${currentuser?.result._id}`
        );
        const data = await res.json();
        setPoints(data.points || 0);
        setDownloads(data.downloadedToday || []); // Make sure you're populating this in the backend
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    if (currentuser?.result?._id) {
      fetchProfileData();
    }
  }, [currentuser]);

  if (!currentuser?.result) return <p>🔐 Please login to view your profile</p>;

  return (
    <div className="profile-container">
      <h1>👤 Profile</h1>
      <p>
        <strong>Name:</strong> {currentuser.result.name}
      </p>
      <p>
        <strong>Email:</strong> {currentuser.result.email}
      </p>
      <p>
        <strong>🏆 Points:</strong> {points}
      </p>

      {/* ✅ Premium Status Logic */}
      {currentuser.result.isPremium ? (
        <p style={{ color: "green", fontWeight: "bold" }}>
          🌟 You are a Premium Member
        </p>
      ) : (
        <button
          onClick={handleRazorpayPayment}
          className="premium-btn"
          style={{
            padding: "10px 20px",
            backgroundColor: "#f37254",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          🚀 Go Premium
        </button>
      )}

      <h2>⬇️ Downloaded Videos (Server)</h2>
      {downloads.length === 0 ? (
        <p>You haven't downloaded any videos yet today.</p>
      ) : (
        <ul className="download-list">
          {downloads.map((video) => (
            <li key={video._id}>
              <Link to={`/videopage/${video._id}`}>
                {video.videotitle || "Untitled Video"}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>📥 downloaded Videos (In-App Only)</h2>
      {savedVideos.length === 0 ? (
        <p>No saved videos in the app.</p>
      ) : (
        <div className="inapp-download-list">
          {savedVideos.map((video) => (
            <div key={video._id} className="inapp-video-box">
              <h4>{video.title || "Untitled Video"}</h4>
              <video
                src={video.blobUrl}
                controls
                width="300"
                style={{ borderRadius: "8px", marginBottom: "10px" }}
              />

              <button
                onClick={() => handleDeleteSavedVideo(video._id)}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}  

export default Profile;
