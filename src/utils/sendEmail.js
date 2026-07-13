import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Define the transporter once, globally for this file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. Generic email sender
export const sendEmail = async ({ to, subject, text }) => {
    console.log("Attempting to send email to:", to);
    const mailOptions = {
        from: `"Auction.X Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    };
    await transporter.sendMail(mailOptions);
};

// 2. Professional Winner Notification
export const sendWinnerEmail = async (winnerEmail, winnerName, productTitle, finalPrice) => {
    const mailOptions = {
        from: `"Auction.X Support" <${process.env.EMAIL_USER}>`,
        to: winnerEmail,
        subject: `🎉 Congratulations! You won ${productTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2e7d32;">Hi ${winnerName},</h2>
                <p style="font-size: 16px; color: #333;">Great news! You have officially won the auction for <strong>${productTitle}</strong>.</p>
                
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #2e7d32;">Your winning bid was:</p>
                    <h3 style="margin: 5px 0 0 0; color: #2e7d32; font-size: 24px;">$${finalPrice.toLocaleString()}</h3>
                </div>

                <p style="font-size: 14px; color: #555;">Please log in to your account dashboard to complete the payment and finalize the shipping details.</p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">This is an automated notification from Auction.X.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Winner email sent successfully to: ${winnerEmail}`);
    } catch (error) {
        console.error('Error sending winner email notification:', error);
    }
};