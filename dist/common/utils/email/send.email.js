"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEmailTrailsKey = exports.UserEmailKey = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../../config");
const domain_exception_1 = require("../../exception/domain.exception");
const UserEmailKey = ({ email, subject }) => {
    return `User::${email}::${subject}_OTP`;
};
exports.UserEmailKey = UserEmailKey;
const UserEmailTrailsKey = ({ email, subject }) => {
    return `User::${email}::${subject}_OTP_Trails`;
};
exports.UserEmailTrailsKey = UserEmailTrailsKey;
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config_1.APP_EMAIL,
        pass: config_1.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
async function sendEmail({ to, cc, bcc, subject, text, html, attachments = [], }) {
    try {
        if (!to?.length && !cc?.length && !bcc?.length) {
            throw new domain_exception_1.BadException("Invalid recipient");
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new domain_exception_1.BadException("Invalid email payload");
        }
        const info = await transporter.sendMail({
            from: `app <${config_1.APP_EMAIL}>`,
            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    }
    catch (err) {
        console.log("Error while sending mail:", err);
        throw err;
    }
}
