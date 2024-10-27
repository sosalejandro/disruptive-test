import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { createUserFactory } from '@/users/factories/user.factory';
import { UserType } from '@/enums';

jest.mock('argon2');

describe('AuthService', () => {
    let service: AuthService;
    let usersService: Partial<UsersService>;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        usersService = {
            findByEmail: jest.fn(),
        };

        jwtService = {
            sign: jest.fn().mockReturnValue('test-token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hashPassword', () => {
        it('should hash the password', async () => {
            const password = 'test-password';
            const hashedPassword = 'hashed-password';
            (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

            const result = await service.hashPassword(password);
            expect(result).toBe(hashedPassword);
            expect(argon2.hash).toHaveBeenCalledWith(password);
        });

        it('should throw an error if hashing fails', async () => {
            const password = 'test-password';
            (argon2.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'));

            await expect(service.hashPassword(password)).rejects.toThrow('Hashing error');
        });
    });

    describe('validateUser', () => {
        it('should return user data if credentials are valid', async () => {
            const email = 'test@example.com';
            const password = 'test-password';
            const user = { id: 1, email, password: 'hashed-password', username: 'testuser', userType: 'user' };
            (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser(email, password);
            expect(result).toEqual({ id: 1, email, username: 'testuser', userType: 'user' });
        });

        it('should throw UnauthorizedException if email isnt found', async () => {
            const email = 'test@example.com';
            const password = 'test-password';
            (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should return a valid JWT token', async () => {
            //   const user = { id: 1, email: 'test@example.com', username: 'testuser', userType: 'user' };
            const user = createUserFactory({ email: 'test@example.com', username: 'testuser', userType: UserType.CREATOR, password: 'test-password' }, "hashedPassword");
            const result = await service.login(user);
            expect(result).toEqual({ access_token: 'test-token' });
            expect(jwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id, role: user.userType });
        });
    });
});