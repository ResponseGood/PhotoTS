import bcrypt from "bcrypt";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    login: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    registerDate:{type:Date,default: new Date()}
});

export const PhotosShema = new Schema({
    albumId: { type: Number, ref: 'album',required: true},
    title: { type:String, required: true },
    url: { type:String, required: true },
    thumbnailUrl: {type:String, required: true},
    owner:{ type: mongoose.Types.ObjectId, required: true}
});

export const AlbumsSchema = new Schema ({
    title: { type:String, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true}
});