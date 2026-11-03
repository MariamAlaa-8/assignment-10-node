"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutEnum = exports.LanguageEnum = exports.TokenTypeEnum = void 0;
var TokenTypeEnum;
(function (TokenTypeEnum) {
    TokenTypeEnum["ACCESS"] = "ACCESS";
    TokenTypeEnum["REFRESH"] = "REFRESH";
})(TokenTypeEnum || (exports.TokenTypeEnum = TokenTypeEnum = {}));
var LanguageEnum;
(function (LanguageEnum) {
    LanguageEnum[LanguageEnum["AR"] = 0] = "AR";
    LanguageEnum[LanguageEnum["EN"] = 1] = "EN";
})(LanguageEnum || (exports.LanguageEnum = LanguageEnum = {}));
var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["DEVICE"] = "DEVICE";
    LogoutEnum["ALL"] = "ALL";
})(LogoutEnum || (exports.LogoutEnum = LogoutEnum = {}));
