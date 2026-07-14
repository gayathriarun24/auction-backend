import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const brevo = new BrevoClient({ 
  apiKey: process.env.BREVO_API_KEY 
});

// Helper for the consistent email container style
const emailContainerStyle = `font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;`;

export const sendOutbidEmail = async (buyerEmail, buyerName, productTitle, newHighestBid) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `⚠️ You've been outbid on ${productTitle}!`,
      sender: { name: "Auction Team", email: "gayathri.dkp@gmail.com" },
      to: [{ email: buyerEmail, name: buyerName }],
      htmlContent: `
        <div style="${emailContainerStyle}">
          <h2 style="color: #d9534f;">Hi ${buyerName},</h2>
          <p>Another bidder just placed a higher offer on <strong>${productTitle}</strong>.</p>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px;">
            <p>The new leading bid is now:</p>
            <h1 style="color: #28a745; margin: 5px 0;">$${newHighestBid.toLocaleString()}</h1>
          </div>
          <p style="margin-top: 20px; font-size: 14px;">If you still want to win this auction, head over to the platform dashboard to increase your bid before the time runs out!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated notification from your Auction Platform.</p>
        </div>`
    });
    console.log(`Outbid email sent to: ${buyerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.body || error);
  }
};

export const sendWinnerEmail = async (winnerEmail, winnerName, productTitle, finalPrice) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `🎉 Congratulations! You won ${productTitle}`,
      sender: { name: "Auction Team", email: "gayathri.dkp@gmail.com" },
      to: [{ email: winnerEmail, name: winnerName }],
      htmlContent: `
        <div style="${emailContainerStyle}">
          <h2 style="color: #2e7d32;">Hi ${winnerName},</h2>
          <p>Great news! You won <strong>${productTitle}</strong>.</p>
          <div style="background-color: #e8f5e9; padding: 15px; text-align: center; border-radius: 5px;">
            <p>Your winning bid was:</p>
            <h1 style="color: #2e7d32; margin: 5px 0;">$${finalPrice.toLocaleString()}</h1>
          </div>
          <p style="margin-top: 20px;">Please check your dashboard to complete the payment and shipping process.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated notification from your Auction Platform.</p>
        </div>`
    });
    console.log(`Winner email sent to: ${winnerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.body || error);
  }
};