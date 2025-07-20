import React, { useState, useEffect } from "react";
import "./Searchbar.css";
import { BsMicFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import Searchlist from "./Searchlist";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Searchbar = () => {
  const [Searchquery, setsearchquery] = useState("");
  const [searchlist, setsearchlist] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Titlearray = useSelector((s) =>
    s?.videoreducer?.data
      ?.filter((q) =>
        q?.videotitle.toUpperCase().includes(Searchquery.toUpperCase())
      )
      ?.map((m) => m?.videotitle)
  );

  return (
    <>
      <div className="SearchBar_Container">
        <div className="SearchBar_Container2">
          <div className="search_div">
            {!isMobile && (
              <input
                type="text"
                className="iBox_SearchBar"
                placeholder="Search"
                onChange={(e) => setsearchquery(e.target.value)}
                value={Searchquery}
                onClick={() => setsearchlist(true)}
              />
            )}
            <Link to={`/search/${Searchquery}`}>
              <FaSearch className="searchIcon_SearchBar" />
            </Link>
            <BsMicFill className="Mic_SearchBar" />
            {!isMobile && Searchquery && searchlist && (
              <Searchlist
                setsearchquery={setsearchquery}
                Titlearray={Titlearray}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchbar;
