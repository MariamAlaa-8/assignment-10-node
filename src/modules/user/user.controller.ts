import { Router, Request, NextFunction, Response } from "express";
import { validation } from "../../middleware/validation.middleware";
import { ResponseFormatter } from "../../middleware/response.middleware";


import { UserService } from "./user.service";
import * as validators from "./user.validation";
import { authentication } from "../authenticantion/auth.middlewere";

const router = Router();
const userService = new UserService();

router.use(authentication());

router.get("/profile/:id", ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.getProfile(req.params.id as string, req.auth?.user._id) };
}));

router.get("/profile", ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.getProfile(req.auth?.user._id, req.auth?.user._id) };
}));
router.patch("/profile", validation(validators.updateProfile), ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.updateProfile(req.auth?.user._id, req.body) };
}));


router.post("/:userId/follow", validation(validators.followUser), ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.followUser(req.auth?.user._id, req.params.userId as string) };
}));

router.delete("/:userId/unfollow", validation(validators.followUser), ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.unfollowUser(req.auth?.user._id, req.params.userId as string) };
}));

router.get("/search", validation(validators.searchUser), ResponseFormatter(async (req: Request,res:Response,next:NextFunction) => {
    return { data: await userService.searchUsers(req.query.search as string) };
}));

export default router;