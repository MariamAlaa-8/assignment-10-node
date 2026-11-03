import { z } from "zod";
import { LanguageEnum } from "../../common/enum/index";
import { generalValidationFields } from "../../common/utils/validation";

export const updateProfile = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            firstname: generalValidationFields.username(lang).optional(),
            lastname: generalValidationFields.username(lang).optional(),
            phone: generalValidationFields.phone(lang).optional(),
            DOB: z.string().optional(),
            gender: generalValidationFields.gender(lang).optional(),
            isPrivate: z.boolean().optional(),
        })
    })
}

export const followUser = (lang: LanguageEnum) => {
    return z.object({
        params: z.strictObject({
            userId: generalValidationFields.id(lang)
        })
    })
}

export const searchUser = (lang: LanguageEnum) => {
    return z.object({
        query: z.strictObject({
            search: z.string().min(1)
        })
    })
}