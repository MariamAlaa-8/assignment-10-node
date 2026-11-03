import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD } from "../../../config";
import { BadException } from "../../exception/domain.exception";
import { EmailSubjectEnum } from "../../enum/email.enum";

export const UserEmailKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }): string => {
    return `User::${email}::${subject}_OTP`;
}


export const UserEmailTrailsKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }): string => {
    return `User::${email}::${subject}_OTP_Trails`;
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: APP_EMAIL,
        pass: APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendEmail({
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments = [],
}: {
    to?: string[],
    cc?: string[],
    bcc?: string[],
    subject: string,
    text?: string, 
    html?: string,
    attachments?: any[],
}) {
    try {
        if (!to?.length && !cc?.length && !bcc?.length) {
            throw new BadException("Invalid recipient");
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new BadException("Invalid email payload");
        }
        
        const info = await transporter.sendMail({
            from: `app <${APP_EMAIL}>`,
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
    } catch (err) {
        console.log("Error while sending mail:", err);
        throw err;
    }
}