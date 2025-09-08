import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_SMTP_HOST,
    port: Number(process.env.GMAIL_SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Chereta Hub" <${process.env.GMAIL_USERNAME}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
