import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryTopicRepository {
  private readonly logger = new Logger(CategoryTopicRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async isCategoryAssociatedWithTopic(categoryId: string, topicId: string): Promise<boolean> {
    this.logger.log(`Checking if category ${categoryId} is associated with topic ${topicId}`);
    try {
      const count = await this.prisma.categoryTopic.count({
        where: {
          categoryId,
          topicId,
        },
      });
      return count > 0;
    } catch (error) {
      this.logger.error('Failed to check category-topic association', error.stack);
      throw new Error('Failed to check category-topic association');
    }
  }
}