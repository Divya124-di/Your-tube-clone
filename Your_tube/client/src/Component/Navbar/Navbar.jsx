import React, { useState, useEffect } from "react";
import logo from "./logo.ico";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
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

  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  // ✅ Fetch user points from backend
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        if (currentuser?.result?._id) {
          const res = await fetch(
            `https://your-tube-clone-rmd1.onrender.com/user/profile/${currentuser?.result?._id}`
          );
          console.log(currentuser?.result?._id);          
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
          console.log("✅ Google Profile:", profileData);
          if (profileData.email) {
            dispatch(login({ email: profileData.email }));
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching Google user info:", err);
        });
    }
  }, [user]);

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
          <div className="burger" onClick={() => toggledrawer()}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo} alt="" />
            <p className="logo_title_navbar">Your-Tube</p>
          </Link>
        </div>

        <Searchbar />
        <RiVideoAddLine size={22} className={"vid_bell_Navbar"} />
        <div className="apps_Box">
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
        </div>
        <IoMdNotificationsOutline size={22} className={"vid_bell_Navbar"} />

        <div className="Auth_cont_Navbar">
          {currentuser ? (
            <>
              {/* ✅ Show User Points */}
              <div className="points_display_navbar">🏆 {points} pts</div>

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

      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}
    </>
  );
};

export default Navbar;
