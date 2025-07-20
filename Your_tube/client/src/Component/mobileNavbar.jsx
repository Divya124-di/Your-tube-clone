import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser, FaPlusCircle } from "react-icons/fa";
import "./mobileNavbar.css";

const MobileNavbar = () => {
  return (
    <div className="MobileNavbar">
      <Link to="/">
        <FaHome />
      </Link>
      <Link to="/search">
        <FaSearch />
      </Link>
      <Link to="/upload">
        <FaPlusCircle />
      </Link>
      <Link to="/profile">
        <FaUser />
      </Link>
    </div>
  );
};

export default MobileNavbar;
