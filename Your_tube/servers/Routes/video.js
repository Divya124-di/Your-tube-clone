import express from "express";
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import {
  uploadvideo,
  getallvideos,
  deletevideo,
  updatePoints,
} from "../Controllers/video.js"; // ✅ add deletevideo
import {
  historycontroller,
  deletehistory,
  getallhistorycontroller,
} from "../Controllers/History.js";
import {
  watchlatercontroller,
  getallwatchlatervontroller,
  deletewatchlater,
} from "../Controllers/watchlater.js";
import {
  likedvideocontroller,
  getalllikedvideo,
  deletelikedvideo,
} from "../Controllers/likedvideo.js";
import upload from "../Helper/filehelper.js";
import auth from "../middleware/auth.js";

const routes = express.Router();

routes.post("/uploadvideo", auth, upload.single("file"), uploadvideo);
routes.get("/getvideos", getallvideos);
routes.delete("/delete/:id", auth, deletevideo); // ✅ your new delete route

routes.patch("/like/:id", auth, likevideocontroller);
routes.patch("/view/:id", viewscontroller);

routes.post("/history", auth, historycontroller);
routes.get("/getallhistory", getallhistorycontroller);
routes.delete("/deletehistory/:userid", auth, deletehistory);

routes.post("/watchlater", auth, watchlatercontroller);
routes.get("/getallwatchlater", getallwatchlatervontroller);
routes.delete("/deletewatchlater/:videoid/:viewer", auth, deletewatchlater);

routes.post("/likevideo", auth, likedvideocontroller);
routes.get("/getalllikevide", getalllikedvideo);
routes.delete("/deletelikevideo/:videoid/:viewer", auth, deletelikedvideo);

routes.post("/watch",  updatePoints); // ✅ secured with auth


export default routes;
