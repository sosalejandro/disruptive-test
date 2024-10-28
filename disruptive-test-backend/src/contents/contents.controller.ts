import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, InternalServerErrorException, BadRequestException, NotFoundException, Logger, Query } from '@nestjs/common';
import { Request } from 'express';
import { ContentService } from './contents.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CreateContentDto } from './dto/create-content.dto';
import { UserType } from '@/enums';
import { UpdateContentDto } from './dto/update-content.dto';
import { Roles } from '@/auth/decorators/user-type.decorator';
import { User } from '@prisma/client';
import { CategoryNotAssociatedWithTopicException, ContentNotFoundException } from '@/errors';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtPayload } from '@/auth/auth.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  private readonly logger = new Logger(ContentController.name);

  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.CREATOR)
  @ApiOperation({ summary: 'Create a new content' })
  @ApiResponse({ status: 201, description: 'The content has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. The category is not associated with the topic.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBearerAuth()
  async createContent(@Body() createContentDto: CreateContentDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    this.logger.log(JSON.stringify(user));
    try {
      return await this.contentService.createContent(createContentDto, user.sub);
    } catch (error) {
      this.logger.error('Failed to create content', error.stack);
      if (error instanceof CategoryNotAssociatedWithTopicException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to create content');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.READER, UserType.CREATOR)
  @ApiOperation({ summary: 'Get all content with optional filters' })
  @ApiResponse({ status: 200, description: 'Return all content.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ name: 'topicId', required: false, description: 'Filter by topic ID' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by content name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (ISO format)' })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['asc', 'desc'], description: 'Order by creation date' })
  @ApiBearerAuth()
  async getAllContent(
    @Query('topicId') topicId?: string,
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    try {
      if (!topicId && !name && !startDate && !endDate && !orderBy) {
        return await this.contentService.getAllContent();
      }
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return await this.contentService.searchContent(topicId, name, start, end, orderBy);
    } catch (error) {
      this.logger.error('Failed to retrieve content', error.stack);
      throw new InternalServerErrorException('Failed to retrieve content');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.READER, UserType.CREATOR)
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Return the content.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiBearerAuth()
  async getContentById(@Param('id') id: string) {
    try {
      return await this.contentService.getContentById(id);
    } catch (error) {
      this.logger.error(`Failed to retrieve content with ID: ${id}`, error.stack);
      if (error instanceof ContentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to retrieve content');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.CREATOR)
  @ApiOperation({ summary: 'Update content by ID' })
  @ApiResponse({ status: 200, description: 'The content has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request. The category is not associated with the topic.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiBearerAuth()
  async updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    try {
      return await this.contentService.updateContent(id, updateContentDto, user.sub);
    } catch (error) {
      this.logger.error(`Failed to update content with ID: ${id}`, error.stack);
      if (error instanceof CategoryNotAssociatedWithTopicException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ContentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to update content');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: 'Delete content by ID' })
  @ApiResponse({ status: 200, description: 'The content has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiBearerAuth()
  async deleteContent(@Param('id') id: string) {
    try {
      return await this.contentService.deleteContent(id);
    } catch (error) {
      this.logger.error(`Failed to delete content with ID: ${id}`, error.stack);
      if (error instanceof ContentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to delete content');
    }
  }
}