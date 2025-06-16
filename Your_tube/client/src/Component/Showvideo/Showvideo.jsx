import React from "react";
import "./Showvideo.css";
import { Link } from "react-router-dom";
import moment from "moment";

const Showvideo = ({ vid }) => {
  return (
    <>
      <Link to={`/videopage/${vid._id}`}>
        <video
          src={`${process.env.REACT_APP_BACKEND_URL}${vid.filepath}`}
          className="video_ShowVideo"
          controls
        />
      </Link>
      <div className="video_description">
        <div className="Chanel_logo_App">
          <div className="fstChar_logo_App">
            {vid?.uploader?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="video_details">
          <p className="title_vid_ShowVideo">
            {vid?.videotitle || "Untitled Video"}
          </p>
          <pre className="vid_views_UploadTime">
            {vid?.uploader || "Unknown"}
          </pre>
          <p className="vid_views_UploadTime">
            {vid?.views} views <span className="dot">•</span>{" "}
            {moment(vid?.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </>
  );
};

export default Showvideo;
