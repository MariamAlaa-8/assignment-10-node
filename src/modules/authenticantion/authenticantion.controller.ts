import { Router, Request, Response, NextFunction } from "express";
import * as validators from "./authentication.validation";
import { validation } from "../../middleware/validation.middleware";
import { ResponseFormatter } from "../../middleware/response.middleware";
import { AuthenticationService } from "./authentication.service";
import { authentication } from "./auth.middlewere";


const router = Router();
const authService = new AuthenticationService();


router.post("/signup", validation(validators.signup), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    return { data: await authService.signup(req.body), status: 201 };
}));

router.patch("/confirm-email", validation(validators.confirmEmail), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    await authService.confirmEmail(req.body);
    return { data: { message: "Email confirmed successfully" }, status: 200 };
}));

router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    await authService.resendConfirmEmail(req.body);
    return { data: { message: "Confirmation email resent successfully" }, status: 200 };
}));

router.post("/login", validation(validators.login), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    return { data: await authService.login(req.body), status: 200 };
}));

router.post("/refresh-token", validation(validators.refreshToken), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    return { data: await authService.refreshToken(req.body), status: 200 };
}));


router.patch("/forget-password", validation(validators.forgetPassword), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    await authService.forgetPassword(req.body);
    return { data: { message: "Reset code sent to your email" }, status: 200 };
}));

router.patch("/reset-password", validation(validators.resetPassword), ResponseFormatter(async (req:Request,res:Response,next:NextFunction) => {
    await authService.resetPassword(req.body);
    return { data: { message: "Password reset successfully" }, status: 200 };
}));
router.post("/google-login", ResponseFormatter(async (req:Request) => {
    const { idToken } = req.body; 
    return { data: await authService.loginWithGoogle({ idToken }) };
}));

export default router;