import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CategoryRepository } from './categories.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository, PrismaService],
})
export class CategoriesModule {}
