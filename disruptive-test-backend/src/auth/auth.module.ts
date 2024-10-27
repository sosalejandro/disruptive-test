import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [forwardRef(() => UsersModule),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
    ConfigModule
  ],
  providers: [AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }