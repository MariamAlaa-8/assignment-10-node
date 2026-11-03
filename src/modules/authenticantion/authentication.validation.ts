import { z } from "zod";
import { LanguageEnum } from "../../common/enum/index";
import { generalValidationFields } from "../../common/utils/validation";

const loginBodySchema = (lang: LanguageEnum) => {
    return z.strictObject({
        email: generalValidationFields.email(lang),
        password: generalValidationFields.password(lang),
    })
}

export const login = (lang: LanguageEnum) => {
    return z.object({ body: loginBodySchema(lang) })
}

export const signup = (lang: LanguageEnum) => {
    return z.object({
        body: loginBodySchema(lang).safeExtend({
            username: generalValidationFields.username(lang),
            phone: generalValidationFields.phone(lang),
            confirmPassword: generalValidationFields.password(lang),
        }).superRefine((data, ctx) => {
            generalValidationFields.matchFields({ original: "password", copy: "confirmPassword", data, ctx, lang })
        })
    })
}

export const resendConfirmEmail = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({ email: generalValidationFields.email(lang) })
    })
}

export const confirmEmail = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            email: generalValidationFields.email(lang),
            otp: generalValidationFields.otp(lang),
        })
    })
}


export const forgetPassword = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({ email: generalValidationFields.email(lang) })
    })
}

export const resetPassword = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            email: generalValidationFields.email(lang),
            otp: generalValidationFields.otp(lang),
            newPassword: generalValidationFields.password(lang),
            confirmPassword: generalValidationFields.password(lang),
        }).superRefine((data, ctx) => {
            generalValidationFields.matchFields({ original: "newPassword", copy: "confirmPassword", data, ctx, lang })
        })
    })
}


export const refreshToken = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            refreshToken: z.string().min(1, "Refresh token required")
        })
    })
}

export const logout = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            refreshToken: z.string().min(1, "Refresh token required"),
            type: z.enum(["DEVICE", "ALL"]).optional()
        })
    })
}