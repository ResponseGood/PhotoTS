import { Request, Response } from "express";
import {UserSchema} from "../models/User";
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
    //res.sendFile('index.html', { root: "../views" });
   res.json({'msg':'login'});
};

