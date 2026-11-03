"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidationFields = void 0;
const zod_1 = require("zod");
const security_enum_1 = require("../enum/security.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const matchFields = ({ original, copy, data, ctx, lang }) => {
    if (data[original] !== data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang === security_enum_1.LanguageEnum.AR
                ? `لا يتطابق ${original} مع ${copy}`
                : `Fail to match between ${original} and ${copy}`
        });
    }
};
exports.generalValidationFields = {
    email: (lang) => zod_1.z.string().email({
        message: lang === security_enum_1.LanguageEnum.AR
            ? "صيغة الإيميل غير صحيحة"
            : "Invalid email"
    }),
    id: (lang) => zod_1.z.string().refine((data) => mongoose_1.default.Types.ObjectId.isValid(data), { message: lang === security_enum_1.LanguageEnum.AR ? "صيغة ID غير صحيحة" : "Invalid ID format" }),
    file: (lang) => zod_1.z.strictObject({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mintype: zod_1.z.string(),
        buffer: zod_1.z.instanceof(Buffer),
        size: zod_1.z.number(),
        path: zod_1.z.string(),
    }),
    otp: (lang) => zod_1.z.string()
        .length(6, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "رمز التحقق يجب أن يكون 6 أرقام"
            : "OTP must be exactly 6 digits"
    })
        .regex(/^\d{6}$/, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "رمز التحقق يجب أن يكون أرقام فقط"
            : "OTP must contain only numbers"
    }),
    password: (lang) => zod_1.z.string()
        .min(9, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "كلمة المرور يجب أن تكون 9 أحرف على الأقل"
            : "Password must be at least 9 characters"
    })
        .max(16, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "كلمة المرور يجب أن لا تتجاوز 16 حرف"
            : "Password must not exceed 16 characters"
    }),
    username: (lang) => zod_1.z.string().min(2, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "عفوا، لا يمكن إدخال اسم مستخدم أقل من حرفين"
            : "Min length is 2 chars"
    }),
    phone: (lang) => zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: lang === security_enum_1.LanguageEnum.AR
            ? "رقم الهاتف غير صحيح"
            : "Invalid phone number"
    }),
    gender: (lang) => zod_1.z.number().int().min(0).max(1),
    matchFields
};
