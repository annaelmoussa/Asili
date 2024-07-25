import sendEmail from "../services/emailService";
import SentEmail from "../models/SentEmail";
import nodemailer from 'nodemailer';

jest.mock("../models/SentEmail");
jest.mock('nodemailer');

describe("EmailService", () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    mockSendMail = jest.fn().mockResolvedValue("Email sent");
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: mockSendMail });
  });

  describe("sendEmail", () => {
    it("should send an email and log it", async () => {
      const emailParams = {
        to: "test@example.com",
        subject: "Hello",
        text: "Hello, world!",
        html: "<p>Hello, world!</p>",
      };

      await sendEmail(emailParams.to, emailParams.subject, emailParams.text, emailParams.html);

      expect(mockSendMail).toHaveBeenCalledWith({
        from: "no.reply.sportco@gmail.com",
        to: emailParams.to,
        subject: emailParams.subject,
        text: emailParams.text,
        html: emailParams.html,
      });

      expect(SentEmail.create).toHaveBeenCalledWith({
        to: emailParams.to,
        subject: emailParams.subject,
        text: emailParams.text,
        html: emailParams.html,
        sentAt: expect.any(Date)
      });
    });

    it("should handle email send failure", async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSendMail.mockRejectedValue(new Error("Failed to send email"));

      await sendEmail("fail@example.com", "Fail Subject", "Fail text", "Fail HTML");

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', "Failed to send email");
      expect(SentEmail.create).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});