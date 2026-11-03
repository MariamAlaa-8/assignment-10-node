import { z } from "zod";
import { confirmEmail, login, signup, resendConfirmEmail, forgetPassword, resetPassword, refreshToken, logout } from "../authentication.validation";

export type ISignupDto = z.infer<ReturnType<typeof signup>>
export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
export type ResendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']
export type ILoginDto = z.infer<ReturnType<typeof login>>['body']
export type ForgetPasswordDto = z.infer<ReturnType<typeof forgetPassword>>['body']
export type ResetPasswordDto = z.infer<ReturnType<typeof resetPassword>>['body']
export type RefreshTokenDto = z.infer<ReturnType<typeof refreshToken>>['body']
export type LogoutDto = z.infer<ReturnType<typeof logout>>['body']