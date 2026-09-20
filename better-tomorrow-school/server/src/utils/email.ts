import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async ({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) => {
  if (!config.email.user || !config.email.pass) {
    console.log('Email not configured, skipping:', { to, subject });
    return;
  }
  await transporter.sendMail({
    from: `"Better Tomorrow School" <${config.email.user}>`,
    to,
    subject,
    html,
    text,
  });
};

export const sendWelcomeEmail = async (email: string, name: string, role: string) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to Better Tomorrow School',
    html: `<p>Dear ${name},</p><p>Welcome to Better Tomorrow School! Your ${role.toLowerCase()} account has been created.</p><p>You can log in at <a href="https://bettertomorrowschool.com/login">Better Tomorrow School</a>.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, name: string, resetLink: string) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset - Better Tomorrow School',
    html: `<p>Dear ${name},</p><p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
};