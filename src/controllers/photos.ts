import { Request, Response } from "express";
import {UserSchema, PhotosSchema, AlbumsSchema} from "../models/schemes";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_PRIVATE_TOKEN } from "../config";



export const load_photos = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.JWT;
    const titlePhoto:string = req.body["title"];
    const urlPhoto:string = req.body["url"];
    const thumbnailUrl:string = req.body["thumbnailUrl"];
    if (titlePhoto && urlPhoto && thumbnailUrl) {
        if (!token) {
            res.sendStatus(403);
        }
        try {
            const data = jwt.verify(token, JWT_PRIVATE_TOKEN);
            const Users = mongoose.model('users', UserSchema);
            const Album = mongoose.model('albums', AlbumsSchema);
            const Photos = mongoose.model('photos', PhotosSchema);
            const Query = { 
                __v: false,
                password: false
            };
            await Users.findOne({_id: data['data']},Query).then((auth_data) => {
                if (auth_data) {
                    Album.find({}, function (err:string, data:any) {
                        if (data.length > 0) {
                            Album.create({_id:data.length,title: "default_title", owner:auth_data["_id"]})
                            .then((result:string) => {
                                if (result) {
                                    Photos.create({
                                        photo_id:uuidv4(),
                                        albumId:data.length,
                                        title:titlePhoto,
                                        url:urlPhoto,
                                        thumbnailUrl:thumbnailUrl,
                                        owner:auth_data["_id"]
                                    }).then(() => res.sendStatus(200))
                                }
                            })
                        } else {
                            Album.create({_id:0,title: "default_title", owner:auth_data["_id"]})
                            .then((result:string) => {
                                if (result) {
                                    Photos.create({
                                        photo_id:uuidv4(),
                                        albumId:data.length,
                                        title:titlePhoto,
                                        url:urlPhoto,
                                        thumbnailUrl:thumbnailUrl,
                                        owner:auth_data["_id"]
                                    }).then(() => res.sendStatus(200))

                                }
                            })
                        }
                    })
                } else {
                    res.sendStatus(403).json({"msg":"Authorization is required to call this method"});
                }
            })
        } catch (e) {
            console.log(e);
            res.sendStatus(403);
        }
    }
};


export const change_album_title = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.JWT;
    if (!token) {
        res.sendStatus(403);
    }
    const albumID: number = req.body["albumid"];
    const newAlbumName: string = req.body["new_album_name"];
    if (albumID != null && newAlbumName) {
        try {
            const data = jwt.verify(token, JWT_PRIVATE_TOKEN);
            const Users = mongoose.model('users', UserSchema);
            const Albums = mongoose.model('albums', AlbumsSchema);
            const Query = { 
                __v: false,
                password: false
            };
            await Users.findOne({_id: data['data']},Query).then((auth_data) => {
                if (auth_data) {
                    Albums.updateOne({_id: albumID}, { $set: {title:newAlbumName}})
                    .then((result) => {
                        if (result) {
                            res.sendStatus(201);
                        }
                    })
                }
            })
        } catch (e) {
            console.log(e);
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(400);

    }
};

export const delete_photo = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.JWT;
    if (!token) {
        res.sendStatus(403);
    }
    const photoID: string = req.body["photoid"];
    if (photoID) {
        try {
            const data = jwt.verify(token, JWT_PRIVATE_TOKEN);
            const Photos = mongoose.model('photos', UserSchema);
            const Users = mongoose.model('users', UserSchema);
            await Users.findOne({_id: data['data']}).then((auth_data) => {
                if (auth_data) {
                    Photos.deleteOne({photo_id: photoID })
                    .then((result) => {
                        if (result) {
                            res.sendStatus(204);
                        }
                    })
                }
            })
        } catch (e) {
            console.log(e);
            res.sendStatus(403);
        }

    }
};

export const delete_album = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.JWT;
    if (!token) {
        res.sendStatus(403);
    }
    const albumID: number = req.body["albumid"];
    if (albumID) {
        try {
            const data = jwt.verify(token, JWT_PRIVATE_TOKEN);
            const Photos = mongoose.model('photos', UserSchema);
            const Users = mongoose.model('users', UserSchema);
            const Albums = mongoose.model('albums', AlbumsSchema);
            await Users.findOne({_id: data['data']}).then((auth_data) => {
                if (auth_data) {
                    Photos.deleteMany({albumId: albumID})
                    .then((result) => {
                        if (result) {
                            Albums.deleteOne({ _id: albumID })
                            .then((result) => {
                                if (result) {
                                    res.sendStatus(200);
                                }
                            })

                        }
                    })
                }
            })

        } catch (err) {
            console.log(err);
            res.sendStatus(403);
        }
    }

};