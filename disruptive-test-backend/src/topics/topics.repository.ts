import { BaseRepository } from '@/interfaces/base.repository';
import { PrismaClient, Topic, Category } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { TopicNotFoundException, DatabaseError, UniqueConstraintViolationError } from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TopicRepository implements BaseRepository<Topic> {
  private readonly logger = new Logger(TopicRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Topic): Promise<Topic> {
    this.logger.log('Creating a new topic');
    try {
      return await this.prisma.topic.create({ data });
    } catch (error) {
      this.logger.error('Failed to create topic', error.stack);
      if (error.code === 'P2002') {
        throw new UniqueConstraintViolationError('Topic name must be unique');
      }
      throw new DatabaseError('Failed to create topic');
    }
  }

  async findAll(): Promise<Topic[]> {
    this.logger.log('Finding all topics');
    try {
      return await this.prisma.topic.findMany();
    } catch (error) {
      this.logger.error('Failed to find topics', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new DatabaseError('Failed to find topics');
    }
  }

  async findById(id: string): Promise<Topic | null> {
    this.logger.log(`Finding topic with ID: ${id}`);
    try {
      const topic = await this.prisma.topic.findUnique({
        where: { id },
        include: { categoryLinks: true },
      });
      if (!topic) {
        throw new TopicNotFoundException(`Topic with ID ${id} not found`);
      }
      return topic;
    } catch (error) {
      this.logger.error(`Failed to find topic with ID: ${id}`, error.stack);
      if (error instanceof TopicNotFoundException) {
        throw error;
      }
      throw new DatabaseError('Failed to find topic');
    }
  }

  async update(id: string, data: Topic): Promise<Topic> {
    this.logger.log(`Updating topic with ID: ${id}`);
    try {
      return await this.prisma.topic.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Failed to update topic with ID: ${id}`, error.stack);
      if (error.code === 'P2002') {
        throw new UniqueConstraintViolationError('Topic name must be unique');
      }
      throw new DatabaseError('Failed to update topic');
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting topic with ID: ${id}`);
    try {
      await this.prisma.topic.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to delete topic with ID: ${id}`, error.stack);
      if (error.code === 'P2025') {
        throw new TopicNotFoundException(`Topic with ID ${id} not found`);
      }
      throw new DatabaseError('Failed to delete topic');
    }
  }

  async searchByName(name: string): Promise<Topic[]> {
    this.logger.log(`Searching topics with name containing: ${name}`);
    try {
      return await this.prisma.topic.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to search topics by name', error.stack);
      throw new DatabaseError('Failed to search topics by name');
    }
  }

  async assignCategories(topicId: string, categoryIds: string[]): Promise<void> {
    this.logger.log(`Assigning categories to topic with ID: ${topicId}`);
    try {
      await this.prisma.categoryTopic.deleteMany({
        where: { topicId },
      });

      const categoryTopics = categoryIds.map((categoryId) => ({
        categoryId,
        topicId,
      }));

      await this.prisma.categoryTopic.createMany({
        data: categoryTopics,
      });
    } catch (error) {
      this.logger.error(`Failed to assign categories to topic with ID: ${topicId}`, error.stack);
      throw new DatabaseError('Failed to assign categories to topic');
    }
  }
}