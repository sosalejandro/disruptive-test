import { Module } from '@nestjs/common';
import { ContentService } from './contents.service';
import { ContentController } from './contents.controller';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ContentRepository } from './content.repository';
import { CategoryTopicRepository } from '@/category-topic/category-topic.repositor';
import { ContentsGateway } from './contents.gateway';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ContentController],
  providers: [ContentsGateway, ContentService, PrismaService, ContentRepository, CategoryTopicRepository],
})
export class ContentsModule { }
