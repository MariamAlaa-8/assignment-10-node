import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email";
import { emailTemplate } from "./confirmEmail.template";
import { EmailSubjectEnum } from "../../enum";

export const emailEvent = new EventEmitter();

type EmailPayload = {
    recipient: { 
        to?: string[], 
        cc?: string[], 
        bcc?: string[] 
    };
    subject?: EmailSubjectEnum;
    data: { code: string }; 
}

emailEvent.on("sendEmail", async ({ 
    recipient, 
    subject = EmailSubjectEnum.CONFIRM_EMAIL, 
    data 
}: EmailPayload) => {
    try {
        await sendEmail({
            to: recipient.to || [], 
            cc: recipient.cc || [],
            bcc: recipient.bcc || [],
            subject: subject.toString(), 
            html: emailTemplate({ subject, code: data.code }), 
            attachments: [] 
        });
    } catch (error) {
        console.log("Failed to send email:", error);
    }
});