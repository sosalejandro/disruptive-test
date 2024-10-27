import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createCategoryFactory } from './factories/category.factory';
import { CategoryNotFoundError, DatabaseError, UniqueConstraintViolationError } from '@/errors';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = createCategoryFactory(createCategoryDto);
    this.logger.log('Creating a new category');
    try {
      const createdCategory = await this.categoryRepository.create(category);
      this.logger.log(`Category created with ID: ${createdCategory.id}`);
      return createdCategory;
    } catch (error) {
      this.logger.error('Failed to create category', error.stack);
      if (error instanceof UniqueConstraintViolationError) {
        throw error;
      }
      throw new DatabaseError('Failed to create category');
    }
  }

  async findAll() {
    this.logger.log('Finding all categories');
    try {
      const categories = await this.categoryRepository.findAll();
      this.logger.log(`Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      this.logger.error('Failed to find categories', error.stack);
      throw new DatabaseError('Failed to find categories');
    }
  }

  async findOne(id: string) {
    this.logger.log(`Finding category with ID: ${id}`);
    try {
      const category = await this.categoryRepository.findById(id);
      this.logger.log(`Category with ID ${id} found`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to find category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to find category');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category with ID: ${id}`);
    try {
      const updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);
      this.logger.log(`Category with ID ${id} updated`);
      return updatedCategory;
    } catch (error) {
      this.logger.error(`Failed to update category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update category');
    }
  }

  async remove(id: string) {
    this.logger.log(`Deleting category with ID: ${id}`);
    try {
      await this.categoryRepository.delete(id);
      this.logger.log(`Category with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete category');
    }
  }
}