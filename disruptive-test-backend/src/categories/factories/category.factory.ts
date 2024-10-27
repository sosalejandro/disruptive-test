import { Category } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { CreateCategoryDto } from '@/categories/dto/create-category.dto';
import { Logger } from '@nestjs/common';

const logger = new Logger('CategoryFactory');

export function createCategoryFactory(createCategoryDto: CreateCategoryDto): Category {
  try {
    logger.log('Generating new ObjectId');
    const id = new ObjectId().toHexString();
    logger.log(`Generated ObjectId: ${id}`);

    logger.log('Setting createdAt and updatedAt dates');
    const createdAt = new Date();
    const updatedAt = createdAt;

    logger.log('Creating category object');
    const category: Category = {
      id,
      name: createCategoryDto.name,
      type: createCategoryDto.type,
      coverImage: createCategoryDto.coverImage || null,
      createdAt,
      updatedAt,
    };

    logger.log('Category object created:', JSON.stringify(category));
    return category;
  } catch (error) {
    logger.error('Error in createCategoryFactory:', error);
    throw error;
  }
}