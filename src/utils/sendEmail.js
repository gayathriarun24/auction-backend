import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

export const sendOutbidEmail = async (buyerEmail, buyerName, productTitle, newHighestBid) => {
  const emailData = new SendSmtpEmail();
  
  emailData.subject = `⚠️ You've been outbid on ${productTitle}!`;
  emailData.sender = { name: "Auction Team", email: "gayathri.dkp@gmail.com" };
  emailData.to = [{ email: buyerEmail, name: buyerName }];
  emailData.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #d9534f;">Hi ${buyerName},</h2>
      <p>Another bidder just placed a higher offer on <strong>${productTitle}</strong>.</p>
      <h3>New leading bid: $${newHighestBid.toLocaleString()}</h3>
    </div>`;

  try {
    await apiInstance.sendTransacEmail(emailData);
    console.log(`Outbid email sent via API to: ${buyerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.response?.body || error);
  }
};

// 4. Winner Notification
export const sendWinnerEmail = async (winnerEmail, winnerName, productTitle, finalPrice) => {
  const emailData = new SendSmtpEmail();
  
  emailData.subject = `🎉 Congratulations! You won ${productTitle}`;
  emailData.sender = { name: "Auction Team", email: "gayathri.dkp@gmail.com" };
  emailData.to = [{ email: winnerEmail, name: winnerName }];
  emailData.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2e7d32;">Hi ${winnerName},</h2>
      <p>Great news! You won <strong>${productTitle}</strong>.</p>
      <h3>Winning bid: $${finalPrice.toLocaleString()}</h3>
    </div>`;

  try {
    await apiInstance.sendTransacEmail(emailData);
    console.log(`Winner email sent via API to: ${winnerEmail}`);
  } catch (error) {
    console.error('Brevo API Error:', error.response?.body || error);
  }
};