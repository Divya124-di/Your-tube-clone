import React, { useEffect } from "react";
import "./Videopage.css";
import moment from "moment";
import Likewatchlatersavebtns from "./Likewatchlatersavebtns";
import { useParams, Link } from "react-router-dom";
import Comment from "../../Component/Comment/Comment";
import { viewvideo } from "../../action/video";
import { addtohistory } from "../../action/history";
import { useSelector, useDispatch } from "react-redux";

const Videopage = () => {
  const { vid } = useParams();
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  const vids = useSelector((state) => state.videoreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);
  const vv = vids?.data?.filter((q) => q._id === vid)[0];

  const handleviews = () => {
    dispatch(viewvideo({ id: vid }));
  };

  const handlehistory = () => {
    dispatch(
      addtohistory({
        videoid: vid,
        viewer: currentuser?.result._id,
      })
    );
  };

//   const handleDeleteVideo = () => {
//     if (window.confirm("Are you sure you want to delete this video?")) {
//       dispatch(deletevideo(vv._id));
//       navigate("/");
//     }
//   };

  useEffect(() => {
    if (currentuser) {
      handlehistory();
    }
    handleviews();
  }, []);

  if (!vv) return <p>Loading video...</p>;

  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage">
            <video
              src={`https://your-tube-clone-rmd1.onrender.com/${vv?.filepath}`}
              className="video_ShowVideo_videoPage"
              controls
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
                {/* {currentuser?.result._id === vv?.uploader && (
                  <button
                    className="delete_btn_videoPage"
                    onClick={() => handleDeleteVideo(vv._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: "6px",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Video
                  </button>
                )} */}
              </div>

              <Link to={"/"} className="chanel_details_videoPage">
                <b className="chanel_logo_videoPage">
                  <p>{vv?.uploader?.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv.uploader}</p>
              </Link>

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
    </>
  );
};

export default Videopage;
