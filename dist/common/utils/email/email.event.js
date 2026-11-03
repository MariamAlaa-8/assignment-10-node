"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const send_email_1 = require("./send.email");
const confirmEmail_template_1 = require("./confirmEmail.template");
const enum_1 = require("../../enum");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("sendEmail", async ({ recipient, subject = enum_1.EmailSubjectEnum.CONFIRM_EMAIL, data }) => {
    try {
        await (0, send_email_1.sendEmail)({
            to: recipient.to || [],
            cc: recipient.cc || [],
            bcc: recipient.bcc || [],
            subject: subject.toString(),
            html: (0, confirmEmail_template_1.emailTemplate)({ subject, code: data.code }),
            attachments: []
        });
    }
    catch (error) {
        console.log("Failed to send email:", error);
    }
});
