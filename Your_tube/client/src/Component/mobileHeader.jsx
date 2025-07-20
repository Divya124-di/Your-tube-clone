import React from "react";
import { BiUserCircle } from "react-icons/bi";
import logo from "../assets/logo.png"; // adjust path as needed
import "./mobileHeader.css"; // adjust path as needed

const mobileHeader = ({ google_login }) => {
  return (
    <div className="MobileHeader">
      <img src={logo} alt="Logo" className="mobileLogo" />
      <p className="Auth_Btn" onClick={google_login}>
        <BiUserCircle size={22} />
      </p>
    </div>
  );
};

export default mobileHeader;
