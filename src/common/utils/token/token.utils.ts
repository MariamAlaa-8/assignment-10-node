import jwt from "jsonwebtoken";
import {  ACCESS_ADMIN_TOKEN_SIGNATURE,  ACCESS_USER_TOKEN_SIGNATURE,  REFRESH_ADMIN_TOKEN_SIGNATURE,  REFRESH_USER_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, 
    REFRESH_TOKEN_EXPIRES_IN } from "../../../config";
import { ROLEENUM, TokenTypeEnum } from "../../enum/index";

export const generateToken = ({
    payload,
    secret,
    options = {}
}: {
    payload: object,
    secret: string,
    options?: jwt.SignOptions
}): string => {
    return jwt.sign(payload, secret, { ...options });
}

export const verifyToken = (token: string, secret: string): any => {
    return jwt.verify(token, secret);
}

export const getSignature = (role: ROLEENUM, type: TokenTypeEnum): string => {
    let signature = "";
    if (type === TokenTypeEnum.ACCESS) {
        signature = role === ROLEENUM.ADMIN ? ACCESS_ADMIN_TOKEN_SIGNATURE : ACCESS_USER_TOKEN_SIGNATURE;
    } else {
        signature = role === ROLEENUM.ADMIN ? REFRESH_ADMIN_TOKEN_SIGNATURE : REFRESH_USER_TOKEN_SIGNATURE;
    }
    return signature;
}

export const getExpiry = (type: TokenTypeEnum): number => {
    return type === TokenTypeEnum.ACCESS ? ACCESS_TOKEN_EXPIRES_IN : REFRESH_TOKEN_EXPIRES_IN;
}