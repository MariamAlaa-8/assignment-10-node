"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.followUser = exports.updateProfile = void 0;
const zod_1 = require("zod");
const validation_1 = require("../../common/utils/validation");
const updateProfile = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            firstname: validation_1.generalValidationFields.username(lang).optional(),
            lastname: validation_1.generalValidationFields.username(lang).optional(),
            phone: validation_1.generalValidationFields.phone(lang).optional(),
            DOB: zod_1.z.string().optional(),
            gender: validation_1.generalValidationFields.gender(lang).optional(),
            isPrivate: zod_1.z.boolean().optional(),
        })
    });
};
exports.updateProfile = updateProfile;
const followUser = (lang) => {
    return zod_1.z.object({
        params: zod_1.z.strictObject({
            userId: validation_1.generalValidationFields.id(lang)
        })
    });
};
exports.followUser = followUser;
const searchUser = (lang) => {
    return zod_1.z.object({
        query: zod_1.z.strictObject({
            search: zod_1.z.string().min(1)
        })
    });
};
exports.searchUser = searchUser;
