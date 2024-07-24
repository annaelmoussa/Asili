import nodemailer from "nodemailer";
import SentEmail from "../models/SentEmail";
import sendEmail from "../services/emailService";

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

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should send an email successfully", async () => {
    await sendEmail(mockTo, mockSubject, mockText, mockHtml);

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: mockTo,
      subject: mockSubject,
      text: mockText,
      html: mockHtml,
    });

    expect(SentEmail.create).toHaveBeenCalledWith({
      to: mockTo,
      subject: mockSubject,
      text: mockText,
      html: mockHtml,
      sentAt: expect.any(Date),
    });

    expect(console.log).toHaveBeenCalledWith(
      "Email sent and logged successfully"
    );
  });

  it("should handle errors when sending email fails", async () => {
    const mockError = new Error("Send mail error");
    (nodemailer.createTransport().sendMail as jest.Mock).mockRejectedValueOnce(
      mockError
    );

    await sendEmail(mockTo, mockSubject, mockText);

    expect(console.error).toHaveBeenCalledWith(
      "Error sending email:",
      mockError.message
    );

    expect(SentEmail.create).not.toHaveBeenCalled();
  });

  it("should handle unknown errors", async () => {
    const mockError = "Unknown error";
    (nodemailer.createTransport().sendMail as jest.Mock).mockRejectedValueOnce(
      mockError
    );

    await sendEmail(mockTo, mockSubject, mockText);

    expect(console.error).toHaveBeenCalledWith("Unknown error sending email");

    expect(SentEmail.create).not.toHaveBeenCalled();
  });

  it("should send email without HTML content", async () => {
    await sendEmail(mockTo, mockSubject, mockText);

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: mockTo,
      subject: mockSubject,
      text: mockText,
      html: undefined,
    });

    expect(SentEmail.create).toHaveBeenCalledWith({
      to: mockTo,
      subject: mockSubject,
      text: mockText,
      html: undefined,
      sentAt: expect.any(Date),
    });
  });
});
