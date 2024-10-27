import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { AuthModule } from '@/auth/auth.module';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService],
  exports: [UsersService]
})
export class UsersModule { }
