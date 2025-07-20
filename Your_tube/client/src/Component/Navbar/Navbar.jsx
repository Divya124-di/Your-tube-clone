import React, { useState, useEffect } from "react";
import logo from "./logo.ico";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { RiVideoAddLine } from "react-icons/ri";
// import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import Searchbar from "./Searchbar/Searchbar";
import Auth from "../../Pages/Auth/Auth";
import axios from "axios";
import { login } from "../../action/auth";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { setcurrentuser } from "../../action/currentuser";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false);
  const [user, setuser] = useState(null);
  const [profile, setprofile] = useState([]);
  const [points, setPoints] = useState(0); // ✅ added
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState({
    pincode: "",
    phone: "",
  });


  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [tempLoginData, setTempLoginData] = useState(null);



  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);


  // ✅ Fetch user points from backend
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        if (currentuser?.result?._id) {
          const backendURL =
            process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

          const res = await fetch(
            `${backendURL}/user/profile/${currentuser?.result?._id}`
          );

          const data = await res.json();
          setPoints(data.points || 0);
        }
      } catch (err) {
        console.error("Failed to fetch points:", err);
      }
    };

    fetchPoints();
  }, [currentuser]);

  const successlogin = () => {
    if (profile.email) {
      dispatch(login({ email: profile.email }));
      console.log(profile.email);
    }
  };

  const google_login = useGoogleLogin({
    onSuccess: (tokenResponse) => setuser(tokenResponse),
    onError: (error) => console.log("Login Failed", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          const profileData = res.data;
          setprofile(profileData);
          setShowLocationModal(true); // ✅ show modal instead of prompt
        })
        .catch((err) => {
          console.error("❌ Error fetching Google user info:", err);
        });
    }
  }, [user]);


  // const handleLocationSubmit = () => {
  //   const { pincode, phone } = locationInput;

  //   if (!pincode || pincode.length !== 6 || !phone || phone.length < 10) {
  //     alert("Please enter valid pincode and phone number.");
  //     return;
  //   }


  //   console.log("Logging in with:", {
  //     email: profile.email,
  //     pincode: locationInput.pincode,
  //     phone: locationInput.phone,
  //   });
    
  //   if (profile?.email) {
  //     dispatch(
  //       login({
  //         email: profile.email,
  //         pincode,
  //         phone,
  //       })
  //     );
  //     setShowLocationModal(false);
  //     setShowOtpModal(true);
  //     setLocationInput({ pincode: "", phone: "" });
  //   }
  // };


  const handleLocationSubmit = () => {
    const { pincode, phone } = locationInput;

    if (!pincode || pincode.length !== 6 || !phone || phone.length < 10) {
      alert("Please enter valid pincode and phone number.");
      return;
    }

    if (profile?.email) {
      const payload = {
        email: profile.email,
        pincode,
        phone,
      };
      setTempLoginData(payload); // Save for OTP step

      dispatch(login(payload)) // This sends OTP
        .then(() => {
          setShowLocationModal(false);
          setOtpModalVisible(true); // Show OTP input
        })
        .catch((err) => {
          console.error("Login error:", err);
          alert("Failed to send OTP.");
        });
    }
  };
  
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", {
        email: profile.email,
        otp: enteredOtp,
      });

      alert("✅ OTP Verified. Login complete.");
      setOtpModalVisible(false);
    } catch (err) {
      alert("❌ OTP verification failed");
    }
  };
  

  const handleOtpSubmit = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", {
        email: tempLoginData.email,
        phone: tempLoginData.phone,
        otp: enteredOtp,
      });

      alert("✅ OTP Verified!");
      setOtpModalVisible(false);
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("❌ Invalid OTP");
    }
  };
  

  const logout = () => {
    dispatch(setcurrentuser(null));
    googleLogout();
    localStorage.clear();
  };

  useEffect(() => {
    const token = currentuser?.token;
    if (token) {
      const decodetoken = jwtDecode(token);
      if (decodetoken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
  }, [currentuser?.token, dispatch]);

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          {/* ☰ Burger Menu */}
          <div className="burger" onClick={() => toggledrawer()}>
            <p></p>
            <p></p>
            <p></p>
          </div>

          {/* Logo */}
          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo} alt="YouTube Logo" className="youtube-logo" />
            <p className="logo_title_navbar">Your-Tube</p>
          </Link>
        </div>

        {/* Searchbar (hidden on small screens) */}
        <div className="Searchbar_Wrapper">
          <Searchbar />
        </div>

        {/* Sign in / Profile */}
        <div className="Auth_cont_Navbar">
          {currentuser ? (
            <>
              {/* Profile Link */}
              <Link to="/profile" className="navbar-profile-link">
                <button className="profile-btn">👤 Profile</button>
              </Link>

              {/* Profile Initial */}
              <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
                <p className="fstChar_logo_App">
                  {currentuser?.result.name
                    ? currentuser.result.name.charAt(0).toUpperCase()
                    : currentuser?.result.email.charAt(0).toUpperCase()}
                </p>
              </div>
            </>
          ) : (
            <p className="Auth_Btn" onClick={() => google_login()}>
              <BiUserCircle size={22} />
              <b>Sign in</b>
            </p>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}

      {showLocationModal && (
        <div className="location-modal">
          <div className="modal-content">
            <h3>🌍 Location Verification</h3>
            <input
              type="text"
              placeholder="Enter Pincode"
              value={locationInput.pincode}
              onChange={(e) =>
                setLocationInput({ ...locationInput, pincode: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLocationSubmit();
              }}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={locationInput.phone}
              onChange={(e) =>
                setLocationInput({ ...locationInput, phone: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLocationSubmit();
              }}
            />
            <button onClick={handleLocationSubmit}>Continue</button>
          </div>
        </div>
      )}

      {otpModalVisible && (
        <div className="location-modal">
          <div className="modal-content">
            <h3>🔐 Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
            <button onClick={handleOtpSubmit}>Verify OTP</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
