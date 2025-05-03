import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.authService.validateUser(
      createAuthDto.email,
      createAuthDto.password,
    );
    return this.authService.login(user);
  }
}
