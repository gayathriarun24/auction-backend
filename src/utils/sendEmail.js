import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize the client using your API Key
const brevo = new BrevoClient({ 
  apiKey: process.env.BREVO_API_KEY 
});

// 2. Outbid Notification
export const sendOutbidEmail = async (buyerEmail, buyerName, productTitle, newHighestBid) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `⚠️ You've been outbid on ${productTitle}!`,
      sender: { name: "Auction Team", email: "gayathri.dkp@gmail.com" },
      to: [{ email: buyerEmail, name: buyerName }],
      htmlContent: `<h2>Hi ${buyerName},</h2><p>You've been outbid on <strong>${productTitle}</strong>. New bid: $${newHighestBid}</p>`
    });
    console.log(`Outbid email sent successfully to: ${buyerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.body || error);
  }
};

// 3. Winner Notification
export const sendWinnerNotification = async (winnerEmail, winnerName, productTitle, finalPrice) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `🎉 Congratulations! You won ${productTitle}`,
      sender: { name: "Auction Team", email: "gayathri.dkp@gmail.com" },
      to: [{ email: winnerEmail, name: winnerName }],
      htmlContent: `<h2>Hi ${winnerName},</h2><p>Great news! You won <strong>${productTitle}</strong>.</p><h3>Winning bid: $${finalPrice}</h3>`
    });
    console.log(`Winner email sent successfully to: ${winnerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.body || error);
  }
};