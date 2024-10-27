import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { User } from '@prisma/client';

interface JwtPayload {
  username: string;
  sub: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user || user.userType !== payload.role) {
      throw new UnauthorizedException();
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
