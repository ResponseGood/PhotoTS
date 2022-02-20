import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface User {
    login:string,
    email:string,
    password:string,
    registerDate:Date
}

interface Photo {
    photo_id: string
    albumId:string,
    title:string,
    url:string,
    thumbnailUrl:string,
    owner:mongoose.Types.ObjectId
}

interface Album {
    title:string,
    owner:mongoose.Types.ObjectId
}


export const UserSchema = new Schema<User>({
    login: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    registerDate:{type:Date,default: new Date()}
});


export const PhotosSchema = new Schema<Photo>({
    photo_id: { type: String, required: true },
    albumId: { type: Number, ref: 'album',required: true},
    title: { type:String, required: true },
    url: { type:String, required: true },
    thumbnailUrl: {type:String, required: true},
    owner:{ type: mongoose.Types.ObjectId, required: true}
});

export const AlbumsSchema = new Schema<Album>({
    _id: { type:String, required: true },
    title: { type:String, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true}
});