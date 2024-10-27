import { PrismaClient, Category } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryNotFoundError, DatabaseError, UniqueConstraintViolationError } from '@/errors';

@Injectable()
export class CategoryRepository {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Category): Promise<Category> {
    this.logger.log('Creating a new category');
    try {
      const category = await this.prisma.category.create({ data });
      this.logger.log(`Category created with ID: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to create category', error.stack);
      if (error.code === 'P2002') {
        throw new UniqueConstraintViolationError('Unique constraint violation: category name already exists');
      }
      throw new DatabaseError('Failed to create category: ' + error.message);
    }
  }

  async findById(id: string): Promise<Category | null> {
    this.logger.log(`Finding category with ID: ${id}`);
    try {
      const category = await this.prisma.category.findUnique({ where: { id } });
      if (!category) {
        this.logger.warn(`Category with ID ${id} not found`);
        throw new CategoryNotFoundError(`Category with ID ${id} not found`);
      }
      this.logger.log(`Category with ID ${id} found`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to find category with ID: ${id}`, error.stack);
      throw new DatabaseError('Failed to find category: ' + error.message);
    }
  }

  async findAll(): Promise<Category[]> {
    this.logger.log('Finding all categories');
    try {
      const categories = await this.prisma.category.findMany();
      this.logger.log(`Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      this.logger.error('Failed to find categories', error.stack);
      throw new DatabaseError('Failed to find categories: ' + error.message);
    }
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    this.logger.log(`Updating category with ID: ${id}`);
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      if (!category) {
        this.logger.warn(`Category with ID ${id} not found`);
        throw new CategoryNotFoundError(`Category with ID ${id} not found`);
      }
      this.logger.log(`Category with ID ${id} updated`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to update category with ID: ${id}`, error.stack);
      if (error.code === 'P2025') {
        throw new CategoryNotFoundError(`Category with ID ${id} not found`);
      }
      throw new DatabaseError('Failed to update category: ' + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting category with ID: ${id}`);
    try {
      await this.prisma.category.delete({ where: { id } });
      this.logger.log(`Category with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete category with ID: ${id}`, error.stack);
      if (error.code === 'P2025') {
        throw new CategoryNotFoundError(`Category with ID ${id} not found`);
      }
      throw new DatabaseError('Failed to delete category: ' + error.message);
    }
  }
}