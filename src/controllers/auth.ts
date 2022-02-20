import { Request, Response } from "express";
import {UserSchema} from "../models/schemes";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_TOKEN } from "../config";


export const register = async (req: Request, res: Response): Promise<void> => {
    const loginData: string = req.body["login"];
    const emailData: string = req.body["email"];
    const passwordData: string = req.body["password"];
    if (loginData && emailData && passwordData) {
        function validateEmail(email: string): boolean {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        const Users = mongoose.model('users', UserSchema);
        if (validateEmail(emailData)) {
            bcrypt.hash(passwordData, 10, function(err, hash) {
                Users.create({login:loginData,email:emailData,password:hash}).then((response) => {
                    if (response) {
                        res.sendStatus(201);
                    }
                })
            })
        } else {
            res.sendStatus(422).json("Specify a valid email");

        }
    } else {
        res.sendStatus(400).json("One of the required arguments is missing, login,email,password");
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const loginData: string = req.body["login"];
    const emailData: string = req.body["email"];
    const passwordData: string = req.body["password"];
    const Users = mongoose.model('users', UserSchema);
    if (emailData && passwordData) {
        function validateEmail(email: string): boolean {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        const Query: object = { 
            __v: false,
        };
        if (validateEmail(emailData)) {
            Users.findOne({email: emailData},Query).then((data) => {
                if (data) {
                    if (emailData === data["email"]) {
                        bcrypt.compare(passwordData, data['password'], function(err, result) {
                            if (result) {
                                const token = jwt.sign({data:data["_id"]}, JWT_PRIVATE_TOKEN);
                                return res
                                .cookie("JWT", token, {httpOnly:true})
                                .json({"message":"Success!"});
                            } else {
                                res.status(422).json({"response":"Bad auth!"});
                            }
                        })
                    }
                } else {
                    res.status(422).json({"response":"Bad auth!"});
                }
            })
        } else {
            res.status(422).json({"response":"Invalid email"});
        }
    }else if (loginData && passwordData) {
        const Query: object = { 
            __v: false,
        };
        Users.findOne({login: loginData},Query).then((data) => {
            if (loginData === data["login"]) {
                bcrypt.compare(passwordData, data['password'], function(err, result) {
                    if (result) {
                        const token = jwt.sign({data:data["_id"]}, JWT_PRIVATE_TOKEN);
                        res.cookie("JWT", token, {httpOnly:true}).json({"message":"Success!"});
                    } else {
                        res.status(422).json({"response":"Bad auth!"});
                    }
                })
            }
        })
    }
};
