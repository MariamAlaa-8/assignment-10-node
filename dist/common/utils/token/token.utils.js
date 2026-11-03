"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiry = exports.getSignature = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const index_1 = require("../../enum/index");
const generateToken = ({ payload, secret, options = {} }) => {
    return jsonwebtoken_1.default.sign(payload, secret, { ...options });
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const getSignature = (role, type) => {
    let signature = "";
    if (type === index_1.TokenTypeEnum.ACCESS) {
        signature = role === index_1.ROLEENUM.ADMIN ? config_1.ACCESS_ADMIN_TOKEN_SIGNATURE : config_1.ACCESS_USER_TOKEN_SIGNATURE;
    }
    else {
        signature = role === index_1.ROLEENUM.ADMIN ? config_1.REFRESH_ADMIN_TOKEN_SIGNATURE : config_1.REFRESH_USER_TOKEN_SIGNATURE;
    }
    return signature;
};
exports.getSignature = getSignature;
const getExpiry = (type) => {
    return type === index_1.TokenTypeEnum.ACCESS ? config_1.ACCESS_TOKEN_EXPIRES_IN : config_1.REFRESH_TOKEN_EXPIRES_IN;
};
exports.getExpiry = getExpiry;
