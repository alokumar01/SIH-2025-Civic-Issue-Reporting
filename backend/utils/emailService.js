import nodemailer from 'nodemailer';

// Simple email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// Send verification email
export const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Verify Your Email',
        text: `Hello ${name}!\n\nClick this link to verify your email:\n${verificationUrl}\n\nThanks!`
    });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Reset Your Password',
        text: `Hello ${name}!\n\nClick this link to reset your password:\n${resetUrl}\n\nThanks!`
    });
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Welcome!',
        text: `Hello ${name}!\n\nWelcome to Civic Reporting System!\n\nYour account is now active.\n\nThanks!`
    });
};