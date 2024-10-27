import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TopicNotFoundException, UniqueConstraintViolationError } from '@/errors';
import { TopicService } from './topics.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UserType } from '@/enums';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Roles } from '@/auth/decorators/user-type.decorator';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { AssignCategoriesDto } from './dto/assign-categories-dto';

@ApiTags('topics')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'The topic has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Conflict. Topic name must be unique.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createTopic(@Body() createTopicDto: CreateTopicDto) {
    try {
      return await this.topicService.createTopic(createTopicDto);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException('Failed to create topic');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search topics by name' })
  @ApiResponse({ status: 200, description: 'Return matching topics.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async searchTopicsByName(@Query('name') name: string) {
    try {
      return await this.topicService.searchTopicsByName(name);
    } catch (error) {
      throw new InternalServerErrorException('Failed to search topics by name');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({ status: 200, description: 'Return all topics.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllTopics() {
    try {
      return await this.topicService.getAllTopics();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve topics');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiResponse({ status: 200, description: 'Return the topic.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTopicById(@Param('id') id: string) {
    try {
      return await this.topicService.getTopicById(id);
    } catch (error) {
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to retrieve topic');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a topic by ID' })
  @ApiResponse({ status: 200, description: 'The topic has been successfully updated.' })
  @ApiResponse({ status: 409, description: 'Conflict. Topic name must be unique.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateTopic(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    try {
      return await this.topicService.updateTopic(id, updateTopicDto);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to update topic');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a topic by ID' })
  @ApiResponse({ status: 200, description: 'The topic has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteTopic(@Param('id') id: string) {
    try {
      await this.topicService.deleteTopic(id);
    } catch (error) {
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to delete topic');
    }
  }

  @Post(':id/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign categories to a topic' })
  @ApiResponse({ status: 200, description: 'Categories have been successfully assigned to the topic.' })
  @ApiResponse({ status: 404, description: 'Topic not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async assignCategoriesToTopic(@Param('id') id: string, @Body() assignCategoriesDto: AssignCategoriesDto) {
    try {
      return await this.topicService.assignCategoriesToTopic(id, assignCategoriesDto.categoryIds);
    } catch (error) {
      if (error instanceof TopicNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to assign categories to topic');
    }
  }
}