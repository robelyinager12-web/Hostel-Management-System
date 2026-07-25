import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"Heroy Hostel" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Verify your Heroy Hostel account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Verify your email</h2>
        <p>Use the code below to verify your Heroy Hostel account. It expires in 10 minutes.</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1E293B;">${otp}</p>
        <p style="color: #64748B; font-size: 13px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}