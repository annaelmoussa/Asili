"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const SentEmail_1 = __importDefault(require("../models/SentEmail"));
const emailService_1 = __importDefault(require("../services/emailService"));
jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: "mocked-message-id" }),
    }),
}));
jest.mock("../models/SentEmail", () => ({
    create: jest.fn().mockResolvedValue({ id: "mocked-id" }),
}));
describe("Email Service", () => {
    const mockTo = "test@example.com";
    const mockSubject = "Test Subject";
    const mockText = "Test Email Body";
    const mockHtml = "<p>Test Email Body</p>";
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.EMAIL_USER = "test@test.com";
        jest.spyOn(console, "log").mockImplementation(() => { });
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("should send an email successfully", async () => {
        await (0, emailService_1.default)(mockTo, mockSubject, mockText, mockHtml);
        expect(nodemailer_1.default.createTransport().sendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: mockTo,
            subject: mockSubject,
            text: mockText,
            html: mockHtml,
        });
        expect(SentEmail_1.default.create).toHaveBeenCalledWith({
            to: mockTo,
            subject: mockSubject,
            text: mockText,
            html: mockHtml,
            sentAt: expect.any(Date),
        });
        expect(console.log).toHaveBeenCalledWith("Email sent and logged successfully");
    });
    it("should handle errors when sending email fails", async () => {
        const mockError = new Error("Send mail error");
        nodemailer_1.default.createTransport().sendMail.mockRejectedValueOnce(mockError);
        await (0, emailService_1.default)(mockTo, mockSubject, mockText);
        expect(console.error).toHaveBeenCalledWith("Error sending email:", mockError.message);
        expect(SentEmail_1.default.create).not.toHaveBeenCalled();
    });
    it("should handle unknown errors", async () => {
        const mockError = "Unknown error";
        nodemailer_1.default.createTransport().sendMail.mockRejectedValueOnce(mockError);
        await (0, emailService_1.default)(mockTo, mockSubject, mockText);
        expect(console.error).toHaveBeenCalledWith("Unknown error sending email");
        expect(SentEmail_1.default.create).not.toHaveBeenCalled();
    });
    it("should send email without HTML content", async () => {
        await (0, emailService_1.default)(mockTo, mockSubject, mockText);
        expect(nodemailer_1.default.createTransport().sendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to: mockTo,
            subject: mockSubject,
            text: mockText,
            html: undefined,
        });
        expect(SentEmail_1.default.create).toHaveBeenCalledWith({
            to: mockTo,
            subject: mockSubject,
            text: mockText,
            html: undefined,
            sentAt: expect.any(Date),
        });
    });
});
