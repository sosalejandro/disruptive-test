import { User } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Logger } from '@nestjs/common';

const logger = new Logger('UserFactory');

export function createUserFactory(createUserDto: CreateUserDto, hashedPassword: string): User {
  try {
    logger.log('Generating new ObjectId');
    const id = new ObjectId().toHexString();
    logger.log(`Generated ObjectId: ${id}`);

    logger.log('Setting createdAt and updatedAt dates');
    const createdAt = new Date();
    const updatedAt = createdAt;

    logger.log('Creating user object');
    const user: User = {
      id,
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      userType: createUserDto.userType,
      createdAt,
      updatedAt,
    };

    logger.log('User object created:', JSON.stringify(user));
    return user;
  } catch (error) {
    logger.error('Error in createUserFactory:', error);
    throw error;
  }
}