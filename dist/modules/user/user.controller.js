"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const response_middleware_1 = require("../../middleware/response.middleware");
const user_service_1 = require("./user.service");
const validators = __importStar(require("./user.validation"));
const auth_middlewere_1 = require("../authenticantion/auth.middlewere");
const router = (0, express_1.Router)();
const userService = new user_service_1.UserService();
router.use((0, auth_middlewere_1.authentication)());
router.get("/profile/:id", (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.getProfile(req.params.id, req.auth?.user._id) };
}));
router.get("/profile", (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.getProfile(req.auth?.user._id, req.auth?.user._id) };
}));
router.patch("/profile", (0, validation_middleware_1.validation)(validators.updateProfile), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.updateProfile(req.auth?.user._id, req.body) };
}));
router.post("/:userId/follow", (0, validation_middleware_1.validation)(validators.followUser), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.followUser(req.auth?.user._id, req.params.userId) };
}));
router.delete("/:userId/unfollow", (0, validation_middleware_1.validation)(validators.followUser), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.unfollowUser(req.auth?.user._id, req.params.userId) };
}));
router.get("/search", (0, validation_middleware_1.validation)(validators.searchUser), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await userService.searchUsers(req.query.search) };
}));
exports.default = router;
