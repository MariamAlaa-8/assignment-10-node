import mongoose from 'mongoose';
import { GENDERENUM, ProvideEnum, ROLEENUM } from '../../common/enum/index';
import { IUser } from '../../common/interface/user.interface';
const userSchema = new mongoose.Schema<IUser>({
    firstname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 26
    },
    lastname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 26
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () :boolean{
            return this.provider==ProvideEnum.SYSTEM

            
        }
    },
    phone: {
        type: String,
    },
    DOB: {
        type: Date
    },
    confirmEmail: {
        type: Date
    },
    image: {
        type: String
    },
    coverImage: {
        type: [String]
    },
    gender: {
        type: Number,
        enum: GENDERENUM,
        default: GENDERENUM.FEMALE
    },
    role: {
        type: Number,
        enum: ROLEENUM,
        default: ROLEENUM.USER
    }
    ,
    provider: {
        type: Number,
        enum:ProvideEnum,
        default: ProvideEnum.SYSTEM
    },

    changeCredtialsTime:Date,
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false }

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,

});

userSchema.virtual('username').set(function (this: any, value: string) {
    const [firstname, lastname] = value?.split(' ') || [];
    this.set({ firstname, lastname });
}).get(function (this: IUser) {
    return `${this.firstname} ${this.lastname}`;
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);