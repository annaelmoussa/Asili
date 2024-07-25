"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const SentEmail_1 = __importDefault(require("../models/SentEmail"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "no.reply.sportco@gmail.com",
        pass: "lvwfpjviseqxuulk",
    },
});
async function sendEmail(to, subject, text, html) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        await SentEmail_1.default.create({
            to,
            subject,
            text,
            html,
            sentAt: new Date(),
        });
        console.log("Email sent and logged successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error sending email:", error.message);
        }
        else {
            console.error("Unknown error sending email");
        }
    }
}
exports.default = sendEmail;
