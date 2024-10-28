import { Content } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { Logger } from '@nestjs/common';
import { CreateContentDto } from '../dto/create-content.dto';

const logger = new Logger('ContentFactory');

export function createContentFactory(createContentDto: CreateContentDto, userId: string): Content {
  try {
    logger.log('Generating new ObjectId');
    const id = new ObjectId().toHexString();
    logger.log(`Generated ObjectId: ${id}`);

    logger.log('Setting createdAt and updatedAt dates');
    const createdAt = new Date();
    const updatedAt = createdAt;

    logger.log('Creating content object');
    const content: Content = {
      id,
      title: createContentDto.title,
      type: createContentDto.type,
      credits: createContentDto.credits,
      userId,
      categoryId: createContentDto.categoryId,
      topicId: createContentDto.topicId,
      createdAt,
      updatedAt,
    };

    logger.log('Content object created:', JSON.stringify(content));
    return content;
  } catch (error) {
    logger.error('Error in createContentFactory:', error);
    throw error;
  }
}