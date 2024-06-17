  import nodemailer from 'nodemailer';
import SentEmail from '../models/SentEmail';

// Create a transporter using your Google account credentials
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "no.reply.sportco@gmail.com",
      pass: "lvwfpjviseqxuulk",
    },
  });

// Function to send an email
async function sendEmail(to: string, subject: string, text: string, html?: string) {
  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    // Log the email in the database
    await SentEmail.create({
      to,
      subject,
      text,
      html,
      sentAt: new Date(),
    });

    console.log('Email sent and logged successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
    } else {
      console.error('Unknown error sending email');
    }
  }
  }
  
  export default sendEmail;