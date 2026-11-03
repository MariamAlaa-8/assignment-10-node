import { Request, Response, NextFunction } from "express";


import { TokenTypeEnum } from "../../common/enum/security.enum";
import { ROLEENUM } from "../../common/enum/user.enum";
import { UnauthorizedException } from "../../common/exception/domain.exception";
import { getSignature, verifyToken } from "../../common/utils/token/token.utils";

export const authentication = (tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) throw new UnauthorizedException("Token required");

        const [prefix, token] = authorization.split(" ");
        if (prefix !== "Bearer" || !token) throw new UnauthorizedException("Invalid token format");

        try {
            const decoded = verifyToken(token, getSignature(ROLEENUM.USER, tokenType));
            req.auth = { user: decoded, token };
            next();
        } catch (error) {
            try {
                const decoded = verifyToken(token, getSignature(ROLEENUM.ADMIN, tokenType));
                req.auth = { user: decoded, token };
                next();
            } catch (error) {
                throw new UnauthorizedException("Invalid or expired token");
            }
        }
    };
};