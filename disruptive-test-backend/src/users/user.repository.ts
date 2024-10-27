import { PrismaClient, User } from '@prisma/client';
import { UniqueConstraintViolationError, UserNotFoundError, DatabaseError } from '@/errors';
import { PrismaService } from '@/prisma/prisma.service';
import { ExtendedUserRepository } from './interfaces/user.repository.interface';
import { Inject } from '@nestjs/common';

export class UserRepository implements ExtendedUserRepository {
    constructor(
        @Inject()
        private readonly prisma: PrismaService) {
    }

    async create(data: User): Promise<User> {
        try {
            return await this.prisma.user.create({ data });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new UniqueConstraintViolationError('Unique constraint violation: username or email already exists');
            }
            throw new DatabaseError('Failed to create user: ' + error.message);
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new UserNotFoundError('User not found');
            }
            return user;
        } catch (error) {
            throw new DatabaseError('Failed to find user: ' + error.message);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw new DatabaseError('Failed to find users: ' + error.message);
        }
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        try {
            const user = await this.prisma.user.update({ where: { id }, data });
            if (!user) {
                throw new UserNotFoundError('User not found');
            }
            return user;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new UserNotFoundError('User not found');
            }
            throw new DatabaseError('Failed to update user: ' + error.message);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new UserNotFoundError('User not found');
            }
            throw new DatabaseError('Failed to delete user: ' + error.message);
        }
    }

    async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { username: username },
                    ],
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to find user by email or username: ' + error.message);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return this.prisma.user.findUnique({ where: { email } });
        } catch (error) {
            throw new DatabaseError('Failed to find user by email: ' + error.message);
        }
    }
}