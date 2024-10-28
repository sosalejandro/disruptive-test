import { forwardRef, Inject, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
  username: string;
  sub: string;
  role: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  // Hash a password before storing it in the database
  async hashPassword(password: string): Promise<string> {
    try {
      this.logger.log('Hashing password');
      const hashedPassword = await argon2.hash(password);
      this.logger.log('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      this.logger.error('Error hashing password:', error);
      throw error;
    }
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload: JwtPayload = { username: user.username, sub: user.id, role: user.userType };
    return { access_token: this.jwtService.sign(payload) };
  }
}
