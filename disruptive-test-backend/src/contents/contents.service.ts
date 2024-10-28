import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ContentRepository } from './content.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { Content } from '@prisma/client';
import { UpdateContentDto } from './dto/update-content.dto';
import { CategoryNotAssociatedWithTopicException, ContentNotFoundException } from '@/errors';
import { ContentsGateway } from './contents.gateway';
import { CategoryTopicRepository } from '@/category-topic/category-topic.repositor';
import { createContentFactory } from './factories/content.factory';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly categoryTopicRepository: CategoryTopicRepository,
    @Inject(forwardRef(() => ContentsGateway))
    private readonly contentsGateway: ContentsGateway,
  ) { }

  async createContent(createContentDto: CreateContentDto, userId: string): Promise<Content> {
    this.logger.log('Creating content');
    try {
      const isCategoryAssociatedWithTopic = await this.categoryTopicRepository.isCategoryAssociatedWithTopic(
        createContentDto.categoryId,
        createContentDto.topicId,
      );

      if (!isCategoryAssociatedWithTopic) {
        this.logger.warn('Category is not associated with the topic');
        throw new CategoryNotAssociatedWithTopicException('The category is not associated with the topic');
      }

      const content = createContentFactory(createContentDto, userId);
      const createdContent = await this.contentRepository.create(content);
      this.contentsGateway.server.emit('contentCreated', createdContent);
      return createdContent;
    } catch (error) {
      this.logger.error('Failed to create content', error.stack);
      throw error;
    }
  }

  async getAllContent(): Promise<Content[]> {
    this.logger.log('Retrieving all content');
    try {
      return await this.contentRepository.findAll();
    } catch (error) {
      this.logger.error('Failed to retrieve content', error.stack);
      throw error;
    }
  }

  async getContentById(id: string): Promise<Content> {
    this.logger.log(`Retrieving content with ID: ${id}`);
    try {
      const content = await this.contentRepository.findById(id);
      if (!content) {
        this.logger.warn(`Content with ID ${id} not found`);
        throw new ContentNotFoundException(`Content with ID ${id} not found`);
      }
      return content;
    } catch (error) {
      this.logger.error(`Failed to retrieve content with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto, userId: string): Promise<Content> {
    this.logger.log(`Updating content with ID: ${id}`);
    try {
      const isCategoryAssociatedWithTopic = await this.categoryTopicRepository.isCategoryAssociatedWithTopic(
        updateContentDto.categoryId,
        updateContentDto.topicId,
      );

      if (!isCategoryAssociatedWithTopic) {
        this.logger.warn('Category is not associated with the topic');
        throw new CategoryNotAssociatedWithTopicException('The category is not associated with the topic');
      }

      const updatedContent = await this.contentRepository.update(id, updateContentDto);
      this.contentsGateway.server.emit('contentUpdated', updatedContent);
      return updatedContent;
    } catch (error) {
      this.logger.error(`Failed to update content with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async deleteContent(id: string): Promise<void> {
    this.logger.log(`Deleting content with ID: ${id}`);
    try {
      await this.contentRepository.delete(id);
      this.contentsGateway.server.emit('contentDeleted', { id });
    } catch (error) {
      this.logger.error(`Failed to delete content with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async searchContent(
    topicId?: string,
    name?: string,
    startDate?: Date,
    endDate?: Date,
    orderBy?: 'asc' | 'desc',
  ): Promise<Content[]> {
    this.logger.log('Searching content with filters');
    try {
      return await this.contentRepository.searchContent(topicId, name, startDate, endDate, orderBy);
    } catch (error) {
      this.logger.error('Failed to search content', error.stack);
      throw error;
    }
  }

  async getContentCountByCategory(topicId?: string): Promise<{ categoryId: string; count: number }[]> {
    this.logger.log('Getting content count by category');
    try {
      return await this.contentRepository.getContentCountByCategory(topicId);
    } catch (error) {
      this.logger.error('Failed to get content count by category', error.stack);
      throw error;
    }
  }
}