import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ConflictException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserType } from '@/enums';
import { Roles } from '@/auth/decorators/user-type.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CategoryNotFoundError, DatabaseError, UniqueConstraintViolationError } from '@/errors';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Conflict. Category already exists.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.log('Creating a new category');
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      this.logger.log(`Category created with ID: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to create category', error.stack);
      if (error instanceof UniqueConstraintViolationError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof DatabaseError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll() {
    this.logger.log('Finding all categories');
    try {
      const categories = await this.categoriesService.findAll();
      this.logger.log(`Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      this.logger.error('Failed to find categories', error.stack);
      if (error instanceof DatabaseError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Finding category with ID: ${id}`);
    try {
      const category = await this.categoriesService.findOne(id);
      this.logger.log(`Category with ID ${id} found`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to find category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DatabaseError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category with ID: ${id}`);
    try {
      const category = await this.categoriesService.update(id, updateCategoryDto);
      this.logger.log(`Category with ID ${id} updated`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to update category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DatabaseError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting category with ID: ${id}`);
    try {
      await this.categoriesService.remove(id);
      this.logger.log(`Category with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete category with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DatabaseError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}