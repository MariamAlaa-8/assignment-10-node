import { userRepository } from "../../common/repository/index";
import { NotfoundException, BadException } from "../../common/exception/index";
import mongoose from "mongoose";

export class UserService {
    private userRepository = userRepository;

  

async getProfile(userId: string, viewerId?: string) {
    const user = await this.userRepository.findById({ id: new mongoose.Types.ObjectId(userId) });
    if (!user) throw new NotfoundException("User not found");

  
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
async updateProfile(userId: string, data: any) {
    const user = await this.userRepository.findByIdAndUpdate({
        id: new mongoose.Types.ObjectId(userId),
        update: { $set: data }, 
        options: { new: true, runValidators: true } 
    });
    if (!user) throw new NotfoundException("User not found");
    return user;
}

    async followUser(myId: string, targetId: string) {
        if (myId === targetId) throw new BadException("You can't follow yourself");
        
        const targetUser = await this.userRepository.findById({ id: new mongoose.Types.ObjectId(targetId) });
        if (!targetUser) throw new NotfoundException("Target user not found");

    
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(myId),
            update: { $addToSet: { following: targetId } }
        });
        
     
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(targetId),
            update: { $addToSet: { followers: myId } }
        });

        return { message: "Followed successfully" };
    }

    async unfollowUser(myId: string, targetId: string) {
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(myId),
            update: { $pull: { following: targetId } }
        });
        
        await this.userRepository.findByIdAndUpdate({
            id: new mongoose.Types.ObjectId(targetId),
            update: { $pull: { followers: myId } }
        });

        return { message: "Unfollowed successfully" };
    }

    async searchUsers(searchTerm: string) {
       
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