import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { TopicRepository } from './topics.repository';
import { Topic } from '@prisma/client';
import { TopicNotFoundException, UniqueConstraintViolationError } from '@/errors';
import { createTopicFactory } from '@/topics/factories/topic.factory';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(private readonly topicRepository: TopicRepository) {}

  async createTopic(createTopicDto: CreateTopicDto): Promise<Topic> {
    this.logger.log('Creating a new topic');
    try {
      const existingTopic = await this.topicRepository.searchByName(createTopicDto.name);
      if (existingTopic.length > 0) {
        throw new UniqueConstraintViolationError('Topic name must be unique');
      }
      const topic = createTopicFactory(createTopicDto);
      return await this.topicRepository.create(topic);
    } catch (error) {
      this.logger.error('Failed to create topic', error.stack);
      if (error instanceof UniqueConstraintViolationError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async getAllTopics(): Promise<Topic[]> {
    this.logger.log('Retrieving all topics');
    try {
      return await this.topicRepository.findAll();
    } catch (error) {
      this.logger.error('Failed to retrieve topics', error.stack);
      throw error;
    }
  }

  async getTopicById(id: string): Promise<Topic> {
    this.logger.log(`Retrieving topic with ID: ${id}`);
    try {
      const topic = await this.topicRepository.findById(id);
      if (!topic) {
        throw new TopicNotFoundException(`Topic with ID ${id} not found`);
      }
      return topic;
    } catch (error) {
      this.logger.error(`Failed to retrieve topic with ID: ${id}`, error.stack);
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async updateTopic(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    this.logger.log(`Updating topic with ID: ${id}`);
    try {
      const existingTopic = await this.topicRepository.searchByName(updateTopicDto.name);
      if (existingTopic.length > 0 && existingTopic[0].id !== id) {
        throw new UniqueConstraintViolationError('Topic name must be unique');
      }
      const topic = createTopicFactory(updateTopicDto);
      return await this.topicRepository.update(id, topic);
    } catch (error) {
      this.logger.error(`Failed to update topic with ID: ${id}`, error.stack);
      if (error instanceof UniqueConstraintViolationError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async deleteTopic(id: string): Promise<void> {
    this.logger.log(`Deleting topic with ID: ${id}`);
    try {
      await this.topicRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to delete topic with ID: ${id}`, error.stack);
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async searchTopicsByName(name: string): Promise<Topic[]> {
    this.logger.log(`Searching topics with name containing: ${name}`);
    try {
      return await this.topicRepository.searchByName(name);
    } catch (error) {
      this.logger.error('Failed to search topics by name', error.stack);
      throw error;
    }
  }

  async assignCategoriesToTopic(topicId: string, categoryIds: string[]): Promise<void> {
    this.logger.log(`Assigning categories to topic with ID: ${topicId}`);
    try {
      await this.topicRepository.assignCategories(topicId, categoryIds);
    } catch (error) {
      this.logger.error(`Failed to assign categories to topic with ID: ${topicId}`, error.stack);
      throw error;
    }
  }
}