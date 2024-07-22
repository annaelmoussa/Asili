import { jest } from '@jest/globals';
import nodemailer from 'nodemailer';
import SentEmail from '../models/SentEmail';
import sendEmail from '../services/emailService';

// Mock nodemailer
jest.mock('nodemailer');

// Mock SentEmail model
jest.mock('../models/SentEmail', () => ({
  create: jest.fn(),
}));

describe('EmailService', () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock for nodemailer's sendMail function
    mockSendMail = jest.fn().mockResolvedValue(undefined as never);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  it('should send an email and log it', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Text';
    const html = '<p>Test HTML</p>';

    await sendEmail(to, subject, text, html);

    // Check if nodemailer's sendMail was called with correct parameters
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    // Check if SentEmail.create was called with correct parameters
    expect(SentEmail.create).toHaveBeenCalledWith({
      to,
      subject,
      text,
      html,
      sentAt: expect.any(Date),
    });
  });

  it('should handle errors when sending email', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockSendMail.mockRejectedValueOnce(new Error('Failed to send email'));

    await sendEmail('test@example.com', 'Test', 'Test');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', 'Failed to send email');
    expect(SentEmail.create).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should send email without HTML', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Text';

    await sendEmail(to, subject, text);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: undefined,
    });

    expect(SentEmail.create).toHaveBeenCalledWith({
      to,
      subject,
      text,
      html: undefined,
      sentAt: expect.any(Date),
    });
  });
});