"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const index_1 = require("../../common/repository/index");
const index_2 = require("../../common/exception/index");
const mongoose_1 = __importDefault(require("mongoose"));
class UserService {
    userRepository = index_1.userRepository;
    async getProfile(userId, viewerId) {
        const user = await this.userRepository.findById({ id: new mongoose_1.default.Types.ObjectId(userId) });
        if (!user)
            throw new index_2.NotfoundException("User not found");
        if (user.isPrivate && userId !== viewerId) {
            return {
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.image,
                isPrivate: user.isPrivate,
                message: "This account is private"
            };
        }
        return user;
    }
    async updateProfile(userId, data) {
        const user = await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(userId),
            update: { $set: data },
            options: { new: true, runValidators: true }
        });
        if (!user)
            throw new index_2.NotfoundException("User not found");
        return user;
    }
    async followUser(myId, targetId) {
        if (myId === targetId)
            throw new index_2.BadException("You can't follow yourself");
        const targetUser = await this.userRepository.findById({ id: new mongoose_1.default.Types.ObjectId(targetId) });
        if (!targetUser)
            throw new index_2.NotfoundException("Target user not found");
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(myId),
            update: { $addToSet: { following: targetId } }
        });
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(targetId),
            update: { $addToSet: { followers: myId } }
        });
        return { message: "Followed successfully" };
    }
    async unfollowUser(myId, targetId) {
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(myId),
            update: { $pull: { following: targetId } }
        });
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose_1.default.Types.ObjectId(targetId),
            update: { $pull: { followers: myId } }
        });
        return { message: "Unfollowed successfully" };
    }
    async searchUsers(searchTerm) {
        return await this.userRepository.find({
            filter: {
                $or: [
                    { firstname: { $regex: searchTerm, $options: "i" } },
                    { lastname: { $regex: searchTerm, $options: "i" } }
                ]
            },
            options: { limit: 10 }
        });
    }
}
exports.UserService = UserService;
