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
const validators = __importStar(require("./authentication.validation"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const response_middleware_1 = require("../../middleware/response.middleware");
const authentication_service_1 = require("./authentication.service");
const router = (0, express_1.Router)();
const authService = new authentication_service_1.AuthenticationService();
router.post("/signup", (0, validation_middleware_1.validation)(validators.signup), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await authService.signup(req.body), status: 201 };
}));
router.patch("/confirm-email", (0, validation_middleware_1.validation)(validators.confirmEmail), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    await authService.confirmEmail(req.body);
    return { data: { message: "Email confirmed successfully" }, status: 200 };
}));
router.patch("/resend-confirm-email", (0, validation_middleware_1.validation)(validators.resendConfirmEmail), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    await authService.resendConfirmEmail(req.body);
    return { data: { message: "Confirmation email resent successfully" }, status: 200 };
}));
router.post("/login", (0, validation_middleware_1.validation)(validators.login), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await authService.login(req.body), status: 200 };
}));
router.post("/refresh-token", (0, validation_middleware_1.validation)(validators.refreshToken), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    return { data: await authService.refreshToken(req.body), status: 200 };
}));
router.patch("/forget-password", (0, validation_middleware_1.validation)(validators.forgetPassword), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    await authService.forgetPassword(req.body);
    return { data: { message: "Reset code sent to your email" }, status: 200 };
}));
router.patch("/reset-password", (0, validation_middleware_1.validation)(validators.resetPassword), (0, response_middleware_1.ResponseFormatter)(async (req, res, next) => {
    await authService.resetPassword(req.body);
    return { data: { message: "Password reset successfully" }, status: 200 };
}));
router.post("/google-login", (0, response_middleware_1.ResponseFormatter)(async (req) => {
    const { idToken } = req.body;
    return { data: await authService.loginWithGoogle({ idToken }) };
}));
exports.default = router;
