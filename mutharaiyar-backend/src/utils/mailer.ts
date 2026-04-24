import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'mastermworld@gmail.com',
    pass: process.env.SMTP_PASS || '',
  },
});

interface FeedbackEmail {
  name: string;
  email: string;
  phone?: string;
  category: string;
  rating: number;
  message: string;
}

const starRating = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export async function sendFeedbackEmail(feedback: FeedbackEmail): Promise<void> {
  const to = process.env.FEEDBACK_EMAIL || 'mastermworld@gmail.com';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f97316, #ef4444); padding: 20px; color: #fff;">
        <h2 style="margin: 0;">New Feedback Received</h2>
        <p style="margin: 4px 0 0; opacity: 0.9;">Mutharaiyar Community Portal</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${feedback.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${feedback.email}">${feedback.email}</a></td></tr>
          ${feedback.phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${feedback.phone}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #666;">Category</td><td style="padding: 8px 0;">${feedback.category}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Rating</td><td style="padding: 8px 0; color: #f59e0b; font-size: 18px;">${starRating(feedback.rating)}  (${feedback.rating}/5)</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
        <h3 style="margin: 0 0 8px; color: #333;">Message</h3>
        <p style="margin: 0; color: #444; line-height: 1.6; white-space: pre-wrap;">${feedback.message}</p>
      </div>
      <div style="background: #f9fafb; padding: 12px 24px; text-align: center; color: #999; font-size: 12px;">
        This email was sent automatically from the Mutharaiyar Community feedback form.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Mutharaiyar Feedback" <${process.env.SMTP_USER || 'mastermworld@gmail.com'}>`,
      to,
      replyTo: feedback.email,
      subject: `[Feedback] ${feedback.category} — ${feedback.name}`,
      html,
    });
    logger.info(`Feedback email sent to ${to} (from ${feedback.name})`);
  } catch (err) {
    logger.error('Failed to send feedback email:', err);
  }
}
