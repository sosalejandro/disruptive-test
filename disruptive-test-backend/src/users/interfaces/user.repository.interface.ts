import { User } from '@prisma/client';
import { BaseRepository } from '@/interfaces/base.repository';

export interface ExtendedUserRepository extends BaseRepository<User> {
  findByEmailOrUsername(email: string, username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}