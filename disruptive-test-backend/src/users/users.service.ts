import { ConflictException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AuthService } from '@/auth/auth.service';
import { User } from '@prisma/client';
import { createUserFactory } from './factories/user.factory';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }


  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      // Check for duplicate username or email
      this.logger.log('Checking for duplicate username or email');
      const existingUser = await this.userRepository.findByEmailOrUsername(
        createUserDto.email,
        createUserDto.username,
      );
      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }

      // Hash the password
      this.logger.log('Hashing password');
      const hashedPassword = await this.authService.hashPassword(createUserDto.password);

      // Use the factory method to create a new User object
      this.logger.log('Creating user object');
      const user = createUserFactory(createUserDto, hashedPassword);

      // Save user to the database
      this.logger.log('Saving user to database');
      const savedUser = await this.userRepository.create(user);

      // Exclude the password field from the result
      this.logger.log('User registered successfully');
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Error registering user:', error);
      throw error;      
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
