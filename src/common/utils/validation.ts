import { z } from "zod"
import { LanguageEnum } from "../enum/security.enum"
import mongoose from"mongoose"
const matchFields = ({ original, copy, data, ctx, lang }:{ original:string, copy:string, data:any, ctx:any, lang:LanguageEnum }) => {
    if (data[original] !== data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang === LanguageEnum.AR
                ? `لا يتطابق ${original} مع ${copy}`
                : `Fail to match between ${original} and ${copy}`
        })
    }
}
export const generalValidationFields = {
    email: (lang:LanguageEnum) => z.string().email({
        message: lang === LanguageEnum.AR
            ? "صيغة الإيميل غير صحيحة"
            : "Invalid email"
    }),
       id: (lang:LanguageEnum) => z.string().refine(
    (data) => mongoose.Types.ObjectId.isValid(data),
    { message: lang === LanguageEnum.AR ? "صيغة ID غير صحيحة" : "Invalid ID format" }
),
        file: (lang:LanguageEnum) =>z.strictObject({
            fieldname:z.string(),
            originalname:z.string(),
            encoding:z.string(),
            mintype:z.string(),
            buffer:z.instanceof(Buffer),
            size:z.number(),
            path:z.string(),
        }),
    otp: (lang:LanguageEnum) => z.string()
        .length(6, {
            message: lang === LanguageEnum.AR
                ? "رمز التحقق يجب أن يكون 6 أرقام"
                : "OTP must be exactly 6 digits"
        })
        .regex(/^\d{6}$/, {
            message: lang === LanguageEnum.AR
                ? "رمز التحقق يجب أن يكون أرقام فقط"
                : "OTP must contain only numbers"
        }),

    password: (lang:LanguageEnum) => z.string()
        .min(9, {
            message: lang === LanguageEnum.AR
                ? "كلمة المرور يجب أن تكون 9 أحرف على الأقل"
                : "Password must be at least 9 characters"
        })
        .max(16, {
            message: lang === LanguageEnum.AR
                ? "كلمة المرور يجب أن لا تتجاوز 16 حرف"
                : "Password must not exceed 16 characters"
        }),

    username: (lang:LanguageEnum) => z.string().min(2, {
        message: lang === LanguageEnum.AR
            ? "عفوا، لا يمكن إدخال اسم مستخدم أقل من حرفين"
            : "Min length is 2 chars"
    }),

    phone: (lang:LanguageEnum) => z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: lang === LanguageEnum.AR
            ? "رقم الهاتف غير صحيح"
            : "Invalid phone number"
    }),

    gender: (lang:LanguageEnum) => z.number().int().min(0).max(1),

    matchFields
}