import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { OrderService } from '../../../modules/order/order.service';
import { OrderRepository } from '../../../modules/order/repository/order.repository';
import { ProductService } from '../../../modules/product/product.service';
import { UserService } from '../../../modules/user/user.service';
import { OrderDetailsFactory } from '../../../modules/order/factory/orderDetails.factory';
import { OrderStatus, PaymentMethod } from '../../../models/order/order.entity';


describe('OrderService', () => {
    let service: OrderService;
    let mockOrderRepo: Partial<Record<keyof OrderRepository, jest.Mock>>;
    let mockProductService: Partial<Record<keyof ProductService, jest.Mock>>;
    let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;
    let mockOrderDetailsFactory: Partial<Record<keyof OrderDetailsFactory, jest.Mock>>;

    beforeEach(async () => {
        mockOrderRepo = {
            createAndSaveOrder: jest.fn(),
            getAllOrders: jest.fn(),
            getOneOrderByUser: jest.fn(),
        };

        mockProductService = {
            getProductByIds: jest.fn(),
        };

        mockUserService = {
            getContactInfoByIdAndUser: jest.fn(),
        };

        mockOrderDetailsFactory = {
            createDetails: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                { provide: OrderRepository, useValue: mockOrderRepo },
                { provide: ProductService, useValue: mockProductService },
                { provide: UserService, useValue: mockUserService },
                { provide: OrderDetailsFactory, useValue: mockOrderDetailsFactory },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and return an order', async () => {
            const user = { id: 'user1' } as any;
            const createOrderDto = {
                contactInfoId: 'contact1',
                orderItems: [{ productId: 'prod1', quantity: 2 }],
                paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
                status: OrderStatus.PENDING,
                notes: 'no'
            };

            const contactInfo = { id: 'contact1' };
            const product = { id: 'prod1', isAvailable: true, price: 100 };
            const orderDetails = [{ product, quantity: 2, price: 100 }];
            const createdOrder = { id: 'order1', user };

            mockUserService.getContactInfoByIdAndUser!.mockResolvedValue(contactInfo);
            mockProductService.getProductByIds!.mockResolvedValue([product]);
            mockOrderDetailsFactory.createDetails!.mockReturnValue({
                details: orderDetails,
                total: 200,
            });
            mockOrderRepo.createAndSaveOrder!.mockResolvedValue(createdOrder);

            const result = await service.create(createOrderDto, user);

            expect(result).toEqual(createdOrder);
            expect(mockOrderRepo.createAndSaveOrder).toHaveBeenCalled();
        });

        it('should throw if product is unavailable', async () => {
            const product = { id: 'prod1', isAvailable: false };
            expect(() => service.checkUnavailableProducts([product as any]))
                .toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all orders of a user', async () => {
            const user = { id: 'user1' } as any;
            const orders = [{ id: 'order1', user }] as any[];

            mockOrderRepo.getAllOrders!.mockResolvedValue(orders);

            const result = await service.findAll(user);
            expect(result).toEqual(orders);
        });
    });

    describe('findOneOrderByUserId', () => {
        it('should return an order if found', async () => {
            const userId = 'user1';
            const orderId = 'order1';
            const order = { id: orderId, user: { id: userId } };

            mockOrderRepo.getOneOrderByUser!.mockResolvedValue(order);

            const result = await service.findOneOrderByUserId(userId, orderId);
            expect(result).toEqual(order);
        });

        it('should throw NotFoundException if order not found', async () => {
            mockOrderRepo.getOneOrderByUser!.mockResolvedValue(null);

            await expect(
                service.findOneOrderByUserId('user1', 'invalid')
            ).rejects.toThrow(NotFoundException);
        });
    });
});
