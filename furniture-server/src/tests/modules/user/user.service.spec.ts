import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserService } from '../../../modules/user/user.service';
import { UserRepository } from '../../../modules/user/repository/user.repository';
import { ContactInfoRepository } from '../../../modules/user/repository/contactInfo.repository';


describe('UserService', () => {
    let service: UserService;
    let userRepository: jest.Mocked<UserRepository>;
    let contactInfoRepository: jest.Mocked<ContactInfoRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: {
                        getAllUsers: jest.fn(),
                        findBy: jest.fn(),
                        createAndSave: jest.fn(),
                    },
                },
                {
                    provide: ContactInfoRepository,
                    useValue: {
                        findAllPaginated: jest.fn(),
                        findOneByIds: jest.fn(),
                        createAndSave: jest.fn(),
                        createAndUpdate: jest.fn(),
                        remove: jest.fn(),
                        isContactInfoUsed: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get(UserRepository);
        contactInfoRepository = module.get(ContactInfoRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUsers', () => {
        it('should return users from repository', async () => {
            const role = 'USER';
            const users = [{ id: '1', email: 'test@example.com' }];
            userRepository.getAllUsers.mockResolvedValue(users);

            const result = await service.getAllUsers({ role } as any);
            expect(result).toEqual(users);
            expect(userRepository.getAllUsers).toHaveBeenCalledWith(role);
        });
    });

    describe('createProfile', () => {
        it('should create and return user entity', async () => {
            const user = { email: 'test@mail.com' };
            const created = { id: '1', ...user };
            userRepository.createAndSave.mockResolvedValue(created as any);

            const result = await service.createProfile(user as any);
            expect(result).toEqual(created);
        });
    });

    describe('getContactInfo', () => {
        it('should return paginated contact info', async () => {
            const contactInfo = [{ id: '1' }];
            contactInfoRepository.findAllPaginated.mockResolvedValue([contactInfo as any, 1]);

            const result = await service.getContactInfo('user1', { page: 1, pageSize: 10 });
            expect(result).toEqual({ contactInfo, totalPages: 1 });
        });
    });

    describe('findBy', () => {
        it('should return user by field', async () => {
            const user = { id: '1', email: 'x@x.ru' };
            userRepository.findBy.mockResolvedValue(user as any);

            const result = await service.findBy('email', 'x@x.ru');
            expect(result).toEqual(user);
        });

        it('should throw if field or value is empty', async () => {
            await expect(service.findBy('', 'value')).rejects.toThrow(NotFoundException);
            await expect(service.findBy('field', '')).rejects.toThrow(NotFoundException);
        });
    });
});
