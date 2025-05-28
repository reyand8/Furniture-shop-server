import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EUserRole } from '../../../models/user/user.entity';
import { UserService } from '../../../modules/user/user.service';
import { AuthService } from '../../../modules/auth/auth.service';
import { RegisterUserDto } from '../../../modules/auth/dto/registerUser.dto';
import { LoginUserDto } from '../../../modules/auth/dto/loginUser.dto';
import { IUser } from '../../../modules/auth/auth.interface';


describe('AuthService', () => {
    let authService: AuthService;
    let userService: Partial<UserService>;
    let jwtService: Partial<JwtService>;

    const mockUser: IUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        isActive: true,
        role: EUserRole.USER,
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
    };




    beforeEach(async () => {
        userService = {
            findBy: jest.fn(),
            createProfile: jest.fn(),
        };

        jwtService = {
            sign: jest.fn().mockReturnValue('token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: userService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    describe('register', () => {
        it('should register a user and return tokens', async () => {
            (userService.findBy as jest.Mock).mockResolvedValue(null);
            (userService.createProfile as jest.Mock).mockResolvedValue(mockUser);

            const dto: RegisterUserDto = {
                email: mockUser.email as string,
                password: '123456',
                firstName: mockUser.firstName as string,
                lastName: mockUser.lastName as string,
            };

            const result = await authService.register(dto);

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
        });

        it('should throw if email already exists', async () => {
            (userService.findBy as jest.Mock).mockResolvedValue(mockUser);

            const dto: RegisterUserDto = {
                email: mockUser.email as string,
                password: '123456',
                firstName: mockUser.firstName as string,
                lastName: mockUser.lastName as string,
            };

            await expect(authService.register(dto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('login', () => {
        it('should login and return tokens', async () => {
            jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

            const dto: LoginUserDto = { email: mockUser.email as string, password: '123456' };
            const result = await authService.login(dto);

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
        });

        it('should throw Unauthorized if user is not found', async () => {
            jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

            const dto: LoginUserDto = { email: mockUser.email as string, password: 'wrongpassword' };
            await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw Forbidden if user is inactive', async () => {
            const inactiveUser = { ...mockUser, isActive: false };
            jest.spyOn(authService, 'validateUser').mockResolvedValue(inactiveUser);

            const dto: LoginUserDto = { email: mockUser.email as string, password: '123456' };
            await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
        });
    });
});
