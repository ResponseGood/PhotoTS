import { Request, Response } from "express";
import {UserSchema} from "../models/schemes";
import mongoose from "mongoose";
import {Md5} from 'ts-md5/dist/md5';


export const register = async (req: Request, res: Response): Promise<void> => {
    const Users = mongoose.model('users', UserSchema);
    const loginData = req.body["login"];
    const emailData = req.body["email"];
    const passwordData = Md5.hashStr(req.body["password"]);
    Users.create({login:loginData,email:emailData,password:passwordData})
};

export const login = async (req: Request, res: Response): Promise<void> => {
   res.json({'msg':'login'});
};

export const load_photos = async (req: Request, res: Response): Promise<void> => {
    res.json({'msg':'load_photos'});
    //1 - check auth
    //2 - validate body params
    //3 - load photos
 };

