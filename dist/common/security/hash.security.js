"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const argon2_1 = __importDefault(require("argon2"));
const hash = async ({ plaintext, rounds = 12, minor = "b", approach = "bcrypt" }) => {
    let cipherText = "";
    switch (approach) {
        case "bcrypt": {
            const salt = await bcrypt_1.default.genSalt(rounds, minor);
            cipherText = await bcrypt_1.default.hash(plaintext, salt);
            break;
        }
        case "argon2": {
            cipherText = await argon2_1.default.hash(plaintext);
            break;
        }
        default: {
            break;
        }
    }
    return cipherText;
};
exports.hash = hash;
const compare = async (plaintext, cipherText, approach = "bcrypt") => {
    let match = false;
    switch (approach) {
        case "bcrypt": {
            match = await bcrypt_1.default.compare(plaintext, cipherText);
            break;
        }
        case "argon2": {
            match = await argon2_1.default.verify(cipherText, plaintext);
            break;
        }
        default: {
            break;
        }
    }
    return match;
};
exports.compare = compare;
