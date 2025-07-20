//import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react"
import Navbar from './Component/Navbar/Navbar';
import { useDispatch, useSelector } from "react-redux";
import Allroutes from "../src/Allroutes"
import { BrowserRouter as Router } from 'react-router-dom';
import Drawersliderbar from '../src/Component/Leftsidebar/Drawersliderbar'
import Createeditchannel from './Pages/Channel/Createeditchannel';
import Videoupload from './Pages/Videoupload/Videoupload';
import { fetchallchannel } from './action/channeluser';
import { getallvideo } from './action/video';
import { getallcomment } from './action/comment';
import { getallhistory } from './action/history';
import { getalllikedvideo } from './action/likedvideo';
import { getallwatchlater } from './action/watchlater';
// import MobileNavbar from "../src/Component/mobileNavbar";


function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({
    display: "none"
  });
  const dispatch = useDispatch()
  const currentuser = useSelector((state) => state.currentuserreducer);
  


  //  const [isMobile, setIsMobile] = useState(false);
  //  useEffect(() => {
  //    const check = () => setIsMobile(window.innerWidth <= 768);
  //    check();
  //    window.addEventListener("resize", check);
  //    return () => window.removeEventListener("resize", check);
  //  }, []);

  useEffect(() => {
    const theme = currentuser?.result?.theme || "dark"; // fallback to dark

    // Optional: check login time (for override)
    const now = new Date();
    const hour = now.getHours();

    const isMorning = hour >= 10 && hour <= 12;
    const isSouth = [
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
      "Andhra Pradesh",
      "Telangana",
    ].includes(currentuser?.result?.state);

    const finalTheme = isMorning && isSouth ? "light" : theme;

    document.body.setAttribute("data-theme", finalTheme); // apply theme globally
  }, [currentuser]);

    // useEffect(() => {
    //   const handleResize = () => {
    //     setIsMobile(window.innerWidth < 768);
    //   };
    //   window.addEventListener("resize", handleResize);
    //   return () => window.removeEventListener("resize", handleResize);
    // }, []);

  
  useEffect(() => {
    dispatch(fetchallchannel())
    dispatch(getallvideo())
    dispatch(getallcomment())
    dispatch(getallhistory())
    dispatch(getalllikedvideo())
    dispatch(getallwatchlater())
  }, [dispatch])



  const toggledrawer = () => {
    if (toggledrawersidebar.display === "none") {
      settogledrawersidebar({
        display: "flex",
      });
    } else {
      settogledrawersidebar({
        display: "none",
      });
    }
  }
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);
  return (
    <Router>
      {videouploadpage && (
        <Videoupload setvideouploadpage={setvideouploadpage} />
      )}
      {editcreatechanelbtn && (
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />
      )}

      {/* ✅ Always show navbar at top */}
     
     
        <Navbar
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          toggledrawer={toggledrawer}
        />
    

      {/* ✅ Main content with padding to prevent overlap */}
      <div>
        <Drawersliderbar
          toggledraw={toggledrawer}
          toggledrawersidebar={toggledrawersidebar}
        />
        <Allroutes
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setvideouploadpage={setvideouploadpage}
        />
      </div>
    </Router>
  );
}

export default App;
