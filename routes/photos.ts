import { Router } from "express";
import cookieParser from 'cookie-parser';
import * as controller from "../controllers/photos";

export const photosRouter = Router();

photosRouter.use(cookieParser());

photosRouter.post("/load-photos", controller.load_photos);
photosRouter.put("/change-album-title",controller.change_album_title);
photosRouter.delete("/delete-photo",controller.delete_photo);
photosRouter.delete("/delete-album",controller.delete_album);
photosRouter.get("/get-photos",controller.get_photos);