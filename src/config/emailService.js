import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the reusable email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send an outbid notification alert
export const sendOutbidEmail = async (buyerEmail, buyerName, productTitle, newHighestBid) => {
    const mailOptions = {
        from: `"Auction Platform" <${process.env.EMAIL_USER}>`,
        to: buyerEmail,
        subject: `⚠️ You've been outbid on ${productTitle}!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #d9534f;">Hi ${buyerName},</h2>
                <p style="font-size: 16px; color: #333;">Another bidder just placed a higher offer on <strong>${productTitle}</strong>.</p>
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666;">The new leading bid is now:</p>
                    <h3 style="margin: 5px 0 0 0; color: #2e7d32; font-size: 24px;">$${newHighestBid.toLocaleString()}</h3>
                </div>
                <p style="font-size: 14px; color: #555;">If you still want to win this auction, head over to the platform dashboard to increase your bid before the time runs out!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">This is an automated notification from your Auction Platform.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Outbid email notification sent successfully to: ${buyerEmail}`);
    } catch (error) {
        console.error('Error sending outbid email notification:', error);
    }
};