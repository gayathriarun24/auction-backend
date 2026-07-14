
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. Outbid Notification
export const sendOutbidEmail = async (buyerEmail, buyerName, productTitle, newHighestBid) => {
  const mailOptions = {
    from: `"Auction Team" <${process.env.EMAIL_USER}>`,
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
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Outbid email sent successfully to: ${buyerEmail}`);
  } catch (error) {
    console.error('Error sending outbid email:', error);
  }
};

// 2. Winner Notification
export const sendWinnerEmail = async (winnerEmail, winnerName, productTitle, finalPrice) => {
  const mailOptions = {
    from: `"Auction Team" <${process.env.EMAIL_USER}>`,
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
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Winner email sent successfully to: ${winnerEmail}`);
  } catch (error) {
    console.error('Error sending winner email:', error);
  }
};