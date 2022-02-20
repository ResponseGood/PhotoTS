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
                        Album.create({_id:data.length + 1,title: "default_title", owner:auth_data["_id"]})
                        .then((result:string) => {
                            if (result) {
                                Photos.count(function (err, count) {
                                    Photos.create({
                                        photo_id:count + 1,
                                        albumId:data.length,
                                        title:titlePhoto,
                                        url:urlPhoto,
                                        thumbnailUrl:thumbnailUrl,
                                        owner:auth_data["_id"]
                                    }).then(() => res.sendStatus(200))
                                })
                            }
                        })
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
            const Photos = mongoose.model('photos', PhotosSchema);
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


export const get_photos = async (req: Request, res: Response): Promise<void> => {
    const ownerID:mongoose.Types.ObjectId = req.body["ownerid"];
    const page: number = req.body["page"];
    const maxCount: number = req.body["maxcount"];
    if (ownerID && maxCount >= 10 && page) {
        const Photos = mongoose.model('photos', PhotosSchema);
        const photosCount = await Photos.count({});
        if (photosCount < maxCount) {
            res.sendStatus(400);
        } else {
            const Query = { 
                __v: false,
                _id: false
            };
            const offset = (page: number,itemsPerPage: number): number => {return (page - 1) * itemsPerPage + 1};
            await Photos.find({owner: ownerID},Query).limit(maxCount).skip(offset(page,10) - 1).then((photoData) => {
                res.json(photoData);
            })

        }
    } else if (!ownerID && maxCount >= 10 && !page) {
        const Query = { 
            __v: false,
            _id: false
        };
        const Photos = mongoose.model('photos', PhotosSchema);
        if (maxCount) {
            const offset = (page: number,itemsPerPage: number): number => {return (page - 1) * itemsPerPage + 1};
            await  Photos.find({},Query).limit(maxCount).skip(offset(page,10) - 1).then(function (photoData) {
                res.json(photoData);
            });
        }

    } else if (maxCount >= 10 && page) {
        const Photos = mongoose.model('photos', PhotosSchema);
        const photosCount = await Photos.count({});
        if (photosCount < maxCount) {
            res.sendStatus(400);
        } else {
            const Query = { 
                __v: false,
                _id: false
            };
            if (maxCount && page) {
                const offset = (page: number,itemsPerPage: number): number => {return (page - 1) * itemsPerPage + 1};
                await Photos.find({},Query).limit(maxCount).skip(offset(page,10) - 1).then((photoData) => {
                    res.json(photoData);
                })
            }
        }

    }
}
