import mongoose from "mongoose";
import { GENDERENUM, ProvideEnum, ROLEENUM } from "../enum/index";

export interface IUser {
    firstname: string;
    lastname: string;
    username?: string;
    email: string;
    password: string;
    phone?: string;
    DOB?: Date;
    confirmEmail?: Date;
    image?: string;
    coverImage: string[];
    gender: GENDERENUM;
    role: ROLEENUM;
    provider: ProvideEnum;
    changeCredtialsTime?: Date;

    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    isPrivate: boolean;
}