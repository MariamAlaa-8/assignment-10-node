"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const security_enum_1 = require("../../common/enum/security.enum");
const user_enum_1 = require("../../common/enum/user.enum");
const domain_exception_1 = require("../../common/exception/domain.exception");
const token_utils_1 = require("../../common/utils/token/token.utils");
const authentication = (tokenType = security_enum_1.TokenTypeEnum.ACCESS) => {
    return (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization)
            throw new domain_exception_1.UnauthorizedException("Token required");
        const [prefix, token] = authorization.split(" ");
        if (prefix !== "Bearer" || !token)
            throw new domain_exception_1.UnauthorizedException("Invalid token format");
        try {
            const decoded = (0, token_utils_1.verifyToken)(token, (0, token_utils_1.getSignature)(user_enum_1.ROLEENUM.USER, tokenType));
            req.auth = { user: decoded, token };
            next();
        }
        catch (error) {
            try {
                const decoded = (0, token_utils_1.verifyToken)(token, (0, token_utils_1.getSignature)(user_enum_1.ROLEENUM.ADMIN, tokenType));
                req.auth = { user: decoded, token };
                next();
            }
            catch (error) {
                throw new domain_exception_1.UnauthorizedException("Invalid or expired token");
            }
        }
    };
};
exports.authentication = authentication;
