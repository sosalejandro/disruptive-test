import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Content } from '@prisma/client';
import { BaseRepository } from '../interfaces/base.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentCreationException, ContentDeletionException, ContentNotFoundException, ContentUpdateException } from '@/errors';

@Injectable()
export class ContentRepository implements BaseRepository<Content> {
    private readonly logger = new Logger(ContentRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(data: Content): Promise<Content> {
        this.logger.log('Creating a new content');
        try {
            // Extract relational IDs from data
            const { userId, categoryId, topicId, ...contentData } = data;

            return await this.prisma.content.create({
                data: {
                    ...contentData,
                    creator: {
                        connect: { id: userId }
                    },
                    category: {
                        connect: { id: categoryId }
                    },
                    topic: {
                        connect: { id: topicId }
                    }
                }
            });
        } catch (error) {
            this.logger.error('Failed to create content', error.stack);
            throw new ContentCreationException('Failed to create content');
        }
    }

    async findAll(): Promise<Content[]> {
        this.logger.log('Finding all content');
        try {
            return await this.prisma.content.findMany();
        } catch (error) {
            this.logger.error('Failed to find content', error.stack);
            throw new ContentNotFoundException('Failed to find content');
        }
    }

    async findById(id: string): Promise<Content | null> {
        this.logger.log(`Finding content with ID: ${id}`);
        try {
            const content = await this.prisma.content.findUnique({
                where: { id },
            });
            if (!content) {
                throw new ContentNotFoundException(`Content with ID ${id} not found`);
            }
            return content;
        } catch (error) {
            this.logger.error(`Failed to find content with ID: ${id}`, error.stack);
            if (error instanceof ContentNotFoundException) {
                throw error;
            }
            throw new ContentNotFoundException('Failed to find content');
        }
    }

    async update(id: string, data: UpdateContentDto): Promise<Content> {
        this.logger.log(`Updating content with ID: ${id}`);
        try {
            return await this.prisma.content.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.logger.error(`Failed to update content with ID: ${id}`, error.stack);
            throw new ContentUpdateException('Failed to update content');
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.log(`Deleting content with ID: ${id}`);
        try {
            await this.prisma.content.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to delete content with ID: ${id}`, error.stack);
            throw new ContentDeletionException('Failed to delete content');
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
            return await this.prisma.content.findMany({
                where: {
                    ...(topicId && { topicId }),
                    ...(name && { title: { contains: name, mode: 'insensitive' } }),
                    ...(startDate && endDate && { createdAt: { gte: startDate, lte: endDate } }),
                },
                orderBy: {
                    createdAt: orderBy || 'asc',
                },
            });
        } catch (error) {
            this.logger.error('Failed to search content', error.stack);
            throw new Error('Failed to search content');
        }
    }

    async getContentCountByCategory(topicId?: string): Promise<{ categoryId: string; count: number }[]> {
        this.logger.log('Getting content count by category');
        try {
            const counts = await this.prisma.content.groupBy({
                by: ['categoryId'],
                where: {
                    ...(topicId && { topicId }),
                },
                _count: {
                    _all: true,
                },
            });
            return counts.map((count) => ({
                categoryId: count.categoryId,
                count: count._count._all,
            }));
        } catch (error) {
            this.logger.error('Failed to get content count by category', error.stack);
            throw new Error('Failed to get content count by category');
        }
    }
}