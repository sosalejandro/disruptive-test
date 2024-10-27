import { Topic } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { CreateTopicDto } from '@/topics/dto/create-topic.dto';
import { Logger } from '@nestjs/common';
import { UpdateTopicDto } from '../dto/update-topic.dto';

const logger = new Logger('TopicFactory');

export function createTopicFactory(createTopicDto: CreateTopicDto | UpdateTopicDto): Topic {
  try {
    logger.log('Generating new ObjectId');
    const id = new ObjectId().toHexString();
    logger.log(`Generated ObjectId: ${id}`);

    logger.log('Setting createdAt and updatedAt dates');
    const createdAt = new Date();
    const updatedAt = createdAt;

    logger.log('Creating topic object');
    const topic: Topic = {
      id,
      name: createTopicDto.name,
      createdAt,
      updatedAt,
    };

    logger.log('Topic object created:', JSON.stringify(topic));
    return topic;
  } catch (error) {
    logger.error('Error in createTopicFactory:', error);
    throw error;
  }
}