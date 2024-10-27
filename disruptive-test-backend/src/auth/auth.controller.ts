import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'token' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }
}
