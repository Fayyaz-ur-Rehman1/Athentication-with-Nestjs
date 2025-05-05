import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtJwtPayload } from './interface/jwt.payload.interface';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async login(user: any) {
    const payload: JwtJwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );
    const resetLink = `http://localhost:3009/auth/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(email, resetLink);

    return { message: 'Reset link sent to email', resetLink };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userRepository.save(user);

      return { message: 'Password has been reset successfully' };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
