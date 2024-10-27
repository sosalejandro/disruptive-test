import { Module } from '@nestjs/common';
import { TopicService } from './topics.service';
import { TopicController } from './topics.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { TopicRepository } from './topics.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TopicController],
  providers: [TopicService, TopicRepository, PrismaService],
})
export class TopicsModule {}
