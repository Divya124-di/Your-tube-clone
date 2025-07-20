import React from "react";
import "./Describechannel.css";
import { FaEdit, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";

const Describechannel = ({
  setvideouploadpage,
  cid,
  seteditcreatechanelbtn,
}) => {
  const channel = useSelector((state) => state.chanelreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);

  const currentchannel = channel.find((c) => c._id === cid);
  console.log("📦 chanelreducer:", channel);
  console.log("🔍 cid from URL:", cid);
  console.log("🔍 currentchannel:", currentchannel);  

  if (!currentchannel) {
    return (
      <p style={{ color: "white", padding: "1rem" }}>🔄 Loading channel...</p>
    );
  }


  return (
    <div className="container3_chanel">
      <div className="chanel_logo_chanel">
        <b>{currentchannel.name?.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_chanel">
        <b>{currentchannel.name}</b>
        <p>{currentchannel.desc}</p>
      </div>

      {currentuser?.result._id === currentchannel._id && (
        <>
          <p
            className="editbtn_chanel"
            onClick={() => seteditcreatechanelbtn(true)}
          >
            <FaEdit /> <b>Edit Channel</b>
          </p>
          <p
            className="uploadbtn_chanel"
            onClick={() => setvideouploadpage(true)}
          >
            <FaUpload /> <b>Upload Video</b>
          </p>
        </>
      )}
    </div>
  );
};

export default Describechannel;
