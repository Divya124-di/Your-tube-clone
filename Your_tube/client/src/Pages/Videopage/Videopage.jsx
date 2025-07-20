import React, { useEffect } from "react";
import "./Videopage.css";
import moment from "moment";
import Likewatchlatersavebtns from "./Likewatchlatersavebtns";
import { useParams, Link, useNavigate } from "react-router-dom";
import Comment from "../../Component/Comment/Comment";
import { viewvideo, deletevideo } from "../../action/video";
import { addtohistory } from "../../action/history";
import { useSelector, useDispatch } from "react-redux";

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const Videopage = () => {
  const { vid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vids = useSelector((state) => state.videoreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);
  const vv = vids?.data?.find((q) => q._id === vid);

  useEffect(() => {
    if (currentuser) handlehistory();
    handleviews();
  }, []);

  const handleviews = () => {
    dispatch(viewvideo({ id: vid }));
  };

  const handlehistory = () => {
    dispatch(addtohistory({ videoid: vid, viewer: currentuser?.result._id }));
  };

  const handleVideoEnd = async () => {
    try {
      const res = await fetch(`${backendURL}/video/watch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentuser?.token}`, // ✅ add token here
        },
        body: JSON.stringify({ userId: currentuser?.result._id }),
      });

      const data = await res.json();
      console.log("✅ Points updated:", data.points);
    } catch (err) {
      console.error("❌ Error updating points:", err);
    }
  };
  

  const handleDeleteVideo = () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deletevideo(vv._id));
      navigate("/");
    }
  };

  const handleDownload = async () => {
    if (!currentuser) {
      alert("Please login to download videos");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/video/download/${vid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentuser?.token}`,
        },
        body: JSON.stringify({ userId: currentuser?.result._id }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Download failed");
        return;
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // ✅ Save to localStorage or Redux or Context (here using localStorage example)
      const downloads = JSON.parse(localStorage.getItem("downloads")) || [];
      downloads.push({
        _id: vv._id,
        title: vv.videotitle,
        blobUrl,
      });
      localStorage.setItem("downloads", JSON.stringify(downloads));

      alert("✅ Video saved inside app (not browser download)");
    } catch (err) {
      console.error("❌ Download error:", err);
      alert("Something went wrong while downloading");
    }
  };
  
  

  useEffect(() => {
    const fetchVideoIfMissing = async () => {
      if (!vv && vid) {
        try {
          const res = await fetch(`${backendURL}/video/${vid}`);
          const data = await res.json();
          // handle setting local state or show it somehow
        } catch (err) {
          console.error("Video fetch failed:", err);
        }
      }
    };
    fetchVideoIfMissing();
  }, [vid, vv]);
  

  if (!vv) return <p>Loading video...</p>;

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <video
            src={`${backendURL}${vv?.filepath?.startsWith("/") ? "" : "/"}${
              vv?.filepath
            }`}
            className="video_ShowVideo_videoPage"
            controls
            onEnded={handleVideoEnd}
          ></video>

          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.videotitle}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views} views <div className="dot"></div>{" "}
                  {moment(vv?.createdat).fromNow()}
                </div>
                <Likewatchlatersavebtns vv={vv} vid={vid} />
              </div>
            </div>

            <Link to={"/"} className="chanel_details_videoPage">
              <b className="chanel_logo_videoPage">
                <p>{vv?.uploader?.charAt(0).toUpperCase()}</p>
              </b>
              <p className="chanel_name_videoPage">{vv.uploader}</p>
            </Link>

            {/* Delete Video Button for uploader only */}
            {currentuser?.result._id === vv?.uploaderId && (
              <button
                className="delete_btn_videoPage"
                onClick={handleDeleteVideo}
              >
                Delete Video
              </button>
            )}

            {/* Download Button */}
            <button className="download_btn_videoPage" onClick={handleDownload}>
              ⬇️ Download
            </button>

            <div className="comments_VideoPage">
              <h2>
                <u>Comments</u>
              </h2>
              <Comment videoid={vv._id} />
            </div>
          </div>
        </div>
        <div className="moreVideoBar">More videos</div>
      </div>
    </div>
  );
};

export default Videopage;
