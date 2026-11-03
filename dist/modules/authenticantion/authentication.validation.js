"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.resetPassword = exports.forgetPassword = exports.confirmEmail = exports.resendConfirmEmail = exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const validation_1 = require("../../common/utils/validation");
const loginBodySchema = (lang) => {
    return zod_1.z.strictObject({
        email: validation_1.generalValidationFields.email(lang),
        password: validation_1.generalValidationFields.password(lang),
    });
};
const login = (lang) => {
    return zod_1.z.object({ body: loginBodySchema(lang) });
};
exports.login = login;
const signup = (lang) => {
    return zod_1.z.object({
        body: loginBodySchema(lang).safeExtend({
            username: validation_1.generalValidationFields.username(lang),
            phone: validation_1.generalValidationFields.phone(lang),
            confirmPassword: validation_1.generalValidationFields.password(lang),
        }).superRefine((data, ctx) => {
            validation_1.generalValidationFields.matchFields({ original: "password", copy: "confirmPassword", data, ctx, lang });
        })
    });
};
exports.signup = signup;
const resendConfirmEmail = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({ email: validation_1.generalValidationFields.email(lang) })
    });
};
exports.resendConfirmEmail = resendConfirmEmail;
const confirmEmail = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            email: validation_1.generalValidationFields.email(lang),
            otp: validation_1.generalValidationFields.otp(lang),
        })
    });
};
exports.confirmEmail = confirmEmail;
const forgetPassword = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({ email: validation_1.generalValidationFields.email(lang) })
    });
};
exports.forgetPassword = forgetPassword;
const resetPassword = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            email: validation_1.generalValidationFields.email(lang),
            otp: validation_1.generalValidationFields.otp(lang),
            newPassword: validation_1.generalValidationFields.password(lang),
            confirmPassword: validation_1.generalValidationFields.password(lang),
        }).superRefine((data, ctx) => {
            validation_1.generalValidationFields.matchFields({ original: "newPassword", copy: "confirmPassword", data, ctx, lang });
        })
    });
};
exports.resetPassword = resetPassword;
const refreshToken = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            refreshToken: zod_1.z.string().min(1, "Refresh token required")
        })
    });
};
exports.refreshToken = refreshToken;
const logout = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            refreshToken: zod_1.z.string().min(1, "Refresh token required"),
            type: zod_1.z.enum(["DEVICE", "ALL"]).optional()
        })
    });
};
exports.logout = logout;
