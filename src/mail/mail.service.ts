import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'delbert.roberts24@ethereal.email',
      pass: 'CCV26adCBgmx2pVwCN',
    },
  });

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: '"Your App" <your-email@gmail.com>',
      to,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
