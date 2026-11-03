"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const index_1 = require("../../common/enum/index");
const email_event_1 = require("../../common/utils/email/email.event");
const send_email_1 = require("../../common/utils/email/send.email");
const otp_1 = require("../../common/utils/otp");
const index_2 = require("../../common/exception/index");
const cache_service_1 = __importDefault(require("../../common/services/cache.service"));
const index_3 = require("../../common/repository/index");
const index_4 = require("../../common/security/index");
const token_utils_1 = require("../../common/utils/token/token.utils");
const config_1 = require("../../config");
const google_auth_library_1 = require("google-auth-library");
const googleClient = new google_auth_library_1.OAuth2Client();
class AuthenticationService {
    userRepository = index_3.userRepository;
    cacheService;
    constructor() {
        this.cacheService = cache_service_1.default;
    }
    async senEmailOtp({ email, subject, expiresIn = 120, maxTrails = 3, blockInSeconds = 300 }) {
        const existOtpTTl = await this.cacheService.ttl({ key: (0, send_email_1.UserEmailKey)({ email, subject }) });
        if (existOtpTTl > 0) {
            throw new index_2.ConflictException(`Sorry we cannot create new otp until existing one become expired please try again later after ${existOtpTTl}s`);
        }
        const oldTrails = await this.cacheService.get({ key: (0, send_email_1.UserEmailTrailsKey)({ email, subject }) }) ?? 0;
        if (oldTrails >= maxTrails) {
            throw new index_2.BadException("Max otp trails reached");
        }
        const code = (0, otp_1.createOtp)();
        await this.cacheService.set({
            key: (0, send_email_1.UserEmailKey)({ email, subject }),
            ttl: expiresIn,
            value: await (0, index_4.hash)({ plaintext: code.toString() })
        });
        const currentTrails = await this.cacheService.incrBy({ key: (0, send_email_1.UserEmailTrailsKey)({ email, subject }) });
        if (currentTrails == maxTrails) {
            await this.cacheService.expire({ key: (0, send_email_1.UserEmailTrailsKey)({ email, subject }), ttl: blockInSeconds });
        }
        email_event_1.emailEvent.emit("sendEmail", {
            recipient: { to: [email] },
            subject,
            data: { code }
        });
    }
    async signup({ username, email, password, phone }) {
        const duplicatedAccount = await this.userRepository.findOne({ filter: { email } });
        if (duplicatedAccount)
            throw new index_2.ConflictException("Email Exist");
        const account = await this.userRepository.createOne({
            data: {
                username,
                email,
                phone: await (0, index_4.encryption)(phone),
                password: await (0, index_4.hash)({ plaintext: password })
            }
        });
        await this.senEmailOtp({ email, subject: index_1.EmailSubjectEnum.CONFIRM_EMAIL });
        return account;
    }
    async confirmEmail({ otp, email }) {
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provider: index_1.ProvideEnum.SYSTEM,
                confirmEmail: { $exists: false }
            }
        });
        if (!account)
            throw new index_2.NotfoundException("Email not Exist");
        const hashOtp = await this.cacheService.get({
            key: (0, send_email_1.UserEmailKey)({ email, subject: index_1.EmailSubjectEnum.CONFIRM_EMAIL }),
        });
        if (!hashOtp || !await (0, index_4.compare)(otp, hashOtp)) {
            throw new index_2.ConflictException("Invalid otp");
        }
        account.confirmEmail = new Date();
        await account.save();
        await this.cacheService.del({ key: (0, send_email_1.UserEmailKey)({ email, subject: index_1.EmailSubjectEnum.CONFIRM_EMAIL }) });
        await this.cacheService.del({ key: (0, send_email_1.UserEmailTrailsKey)({ email, subject: index_1.EmailSubjectEnum.CONFIRM_EMAIL }) });
        return;
    }
    async resendConfirmEmail({ email }) {
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provider: index_1.ProvideEnum.SYSTEM,
                confirmEmail: { $exists: false }
            }
        });
        if (!account)
            throw new index_2.NotfoundException("Email not Exist");
        await this.senEmailOtp({ email, subject: index_1.EmailSubjectEnum.CONFIRM_EMAIL });
        return;
    }
    async login({ email, password }) {
        const account = await this.userRepository.findOne({ filter: { email, provider: index_1.ProvideEnum.SYSTEM } });
        if (!account)
            throw new index_2.NotfoundException("Invalid login credentials");
        if (!account.confirmEmail)
            throw new index_2.ForbiddenException("Please confirm your email first");
        const isMatch = await (0, index_4.compare)(password, account.password);
        if (!isMatch)
            throw new index_2.NotfoundException("Invalid login credentials");
        const accessToken = (0, token_utils_1.generateToken)({
            payload: { _id: account._id, role: account.role },
            secret: (0, token_utils_1.getSignature)(account.role, index_1.TokenTypeEnum.ACCESS),
            options: { expiresIn: (0, token_utils_1.getExpiry)(index_1.TokenTypeEnum.ACCESS) }
        });
        const refreshToken = (0, token_utils_1.generateToken)({
            payload: { _id: account._id, role: account.role },
            secret: (0, token_utils_1.getSignature)(account.role, index_1.TokenTypeEnum.REFRESH),
            options: { expiresIn: (0, token_utils_1.getExpiry)(index_1.TokenTypeEnum.REFRESH) }
        });
        return { accessToken, refreshToken };
    }
    async refreshToken({ refreshToken }) {
        let decoded;
        try {
            decoded = (0, token_utils_1.verifyToken)(refreshToken, (0, token_utils_1.getSignature)(index_1.ROLEENUM.USER, index_1.TokenTypeEnum.REFRESH));
        }
        catch (error) {
            decoded = (0, token_utils_1.verifyToken)(refreshToken, (0, token_utils_1.getSignature)(index_1.ROLEENUM.ADMIN, index_1.TokenTypeEnum.REFRESH));
        }
        const isRevoked = await this.cacheService.get({ key: `revoked_token::${refreshToken}` });
        if (isRevoked)
            throw new index_2.UnauthorizedException("Token is revoked, please login again");
        const accessToken = (0, token_utils_1.generateToken)({
            payload: { _id: decoded._id, role: decoded.role },
            secret: (0, token_utils_1.getSignature)(decoded.role, index_1.TokenTypeEnum.ACCESS),
            options: { expiresIn: (0, token_utils_1.getExpiry)(index_1.TokenTypeEnum.ACCESS) }
        });
        return { accessToken };
    }
    async forgetPassword({ email }) {
        const account = await this.userRepository.findOne({ filter: { email, provider: index_1.ProvideEnum.SYSTEM } });
        if (!account)
            throw new index_2.NotfoundException("Email not Exist");
        await this.senEmailOtp({ email, subject: index_1.EmailSubjectEnum.FORGOT_PASSWORD });
        return;
    }
    async resetPassword({ email, otp, newPassword }) {
        const account = await this.userRepository.findOne({ filter: { email, provider: index_1.ProvideEnum.SYSTEM } });
        if (!account)
            throw new index_2.NotfoundException("Email not Exist");
        const hashOtp = await this.cacheService.get({
            key: (0, send_email_1.UserEmailKey)({ email, subject: index_1.EmailSubjectEnum.FORGOT_PASSWORD }),
        });
        if (!hashOtp || !await (0, index_4.compare)(otp, hashOtp)) {
            throw new index_2.ConflictException("Invalid otp");
        }
        account.password = await (0, index_4.hash)({ plaintext: newPassword });
        account.changeCredentialsTime = new Date();
        await account.save();
        await this.cacheService.del({ key: (0, send_email_1.UserEmailKey)({ email, subject: index_1.EmailSubjectEnum.FORGOT_PASSWORD }) });
        await this.cacheService.del({ key: (0, send_email_1.UserEmailTrailsKey)({ email, subject: index_1.EmailSubjectEnum.FORGOT_PASSWORD }) });
        return;
    }
    async loginWithGoogle({ idToken }) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: config_1.WEB_CLIENT_IDs,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new index_2.BadException("Invalid Google token");
        }
        const { email, given_name, family_name, picture, email_verified } = payload;
        let account = await this.userRepository.findOne({ filter: { email } });
        if (!account) {
            account = await this.userRepository.createOne({
                data: {
                    firstname: given_name || "Google",
                    lastname: family_name || "User",
                    email,
                    provider: index_1.ProvideEnum.GOOGLE,
                    image: picture,
                    confirmEmail: email_verified ? new Date() : undefined,
                    password: "GOOGLE_AUTH_PASSWORD",
                }
            });
        }
        else if (account.provider !== index_1.ProvideEnum.GOOGLE) {
            throw new index_2.ConflictException("Email already registered with system, please login with password");
        }
        const accessToken = (0, token_utils_1.generateToken)({
            payload: { _id: account._id, role: account.role },
            secret: (0, token_utils_1.getSignature)(account.role, index_1.TokenTypeEnum.ACCESS),
            options: { expiresIn: (0, token_utils_1.getExpiry)(index_1.TokenTypeEnum.ACCESS) }
        });
        const refreshToken = (0, token_utils_1.generateToken)({
            payload: { _id: account._id, role: account.role },
            secret: (0, token_utils_1.getSignature)(account.role, index_1.TokenTypeEnum.REFRESH),
            options: { expiresIn: (0, token_utils_1.getExpiry)(index_1.TokenTypeEnum.REFRESH) }
        });
        return { accessToken, refreshToken };
    }
}
exports.AuthenticationService = AuthenticationService;
