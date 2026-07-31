const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const generateTicket = require("./generateTicket");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (booking) => {
    try {
        console.log("Inside sendBookingEmail");

        const userEmail = booking.userId.email;
        const userName = booking.userId.name;
        const eventTitle = booking.eventId.title;

        const pdfBuffer = await generateTicket(booking);

require("fs").writeFileSync("/tmp/test.pdf", pdfBuffer);
console.log("PDF written successfully");
        console.log("Is Buffer:", Buffer.isBuffer(pdfBuffer));
        console.log("PDF Size:", pdfBuffer.length);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
            `,
            attachments: [
                {
                    filename: "EliteTicket.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Mail sent:", info);

    } catch (error) {
        console.error("FULL ERROR:", error);
    }
};
const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your EliteTickets Account' : 'EliteTickets Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new EliteTickets account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };