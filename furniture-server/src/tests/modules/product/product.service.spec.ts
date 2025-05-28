import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ProductService } from '../../../modules/product/product.service';
import { CategoryRepository } from '../../../modules/product/repository/category.repository';
import { ProductRepository } from '../../../modules/product/repository/product.repository';


const mockCategoryRepository = () => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    createCategory: jest.fn(),
    save: jest.fn(),
});

const mockProductRepository = () => ({
    findPaginated: jest.fn(),
    createProduct: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findByType: jest.fn(),
    searchByName: jest.fn(),
    findTopSellers: jest.fn(),
    findProductsByIds: jest.fn(),
});

describe('ProductService', () => {
    let productService: ProductService;
    let categoryRepo;
    let productRepo;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: CategoryRepository, useFactory: mockCategoryRepository },
                { provide: ProductRepository, useFactory: mockProductRepository },
            ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        categoryRepo = module.get(CategoryRepository);
        productRepo = module.get(ProductRepository);
    });

    describe('getCategories', () => {
        it('should return all categories', async () => {
            const mockCategories = [{ id: '1', name: 'Cat1' }];
            categoryRepo.findAll.mockResolvedValue(mockCategories);

            const result = await productService.getCategories(true);
            expect(result).toEqual(mockCategories);
            expect(categoryRepo.findAll).toHaveBeenCalledWith(true);
        });
    });

    describe('getCategory', () => {
        it('should return a category by id', async () => {
            const mockCategory = { id: '1', name: 'Cat1' };
            categoryRepo.findById.mockResolvedValue(mockCategory);

            const result = await productService.getCategory('1', true);
            expect(result).toEqual(mockCategory);
        });

        it('should throw if not found', async () => {
            categoryRepo.findById.mockResolvedValue(null);
            await expect(productService.getCategory('1', false)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            categoryRepo.findByName.mockResolvedValue(null);
            categoryRepo.createCategory.mockResolvedValue({ id: '1', name: 'New' });

            const result = await productService.createCategory('New');
            expect(result.name).toEqual('New');
        });

        it('should throw if name is missing', async () => {
            await expect(productService.createCategory('')).rejects.toThrow(BadRequestException);
        });

        it('should throw if name already exists', async () => {
            categoryRepo.findByName.mockResolvedValue({ id: '1', name: 'Existing' });
            await expect(productService.createCategory('Existing')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getProducts', () => {
        it('should return products and total pages', async () => {
            productRepo.findPaginated.mockResolvedValue([[{ id: 'p1' }], 15]);

            const result = await productService.getProducts({ page: 1, pageSize: 10 }, true);
            expect(result.totalPages).toEqual(2);
            expect(result.products.length).toBeGreaterThan(0);
        });
    });

    describe('createProduct', () => {
        it('should create and return a product', async () => {
            const dto = { name: 'Prod1', categoryId: 'cat1', price: 100 };
            productRepo.createProduct.mockResolvedValue({ id: '1', ...dto });

            const result = await productService.createProduct(dto as any);
            expect(result.name).toEqual('Prod1');
        });
    });

    describe('updateProduct', () => {
        it('should update and return a product', async () => {
            const product = { id: '1', name: 'Old' };
            const dto = { name: 'Updated' };
            productRepo.findById.mockResolvedValue(product);
            productRepo.update.mockResolvedValue({ ...product, ...dto });

            const result = await productService.updateProduct('1', dto as any);
            expect(result.name).toBe('Updated');
        });

        it('should throw if product not found', async () => {
            productRepo.findById.mockResolvedValue(null);
            await expect(productService.updateProduct('1', { name: 'X' } as any)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getProductById', () => {
        it('should return a product by id', async () => {
            productRepo.findById.mockResolvedValue({ id: '1', name: 'Prod' });
            const result = await productService.getProductById('1', true);
            expect(result).toEqual({ id: '1', name: 'Prod' });
        });

        it('should throw if not found', async () => {
            productRepo.findById.mockResolvedValue(null);
            await expect(productService.getProductById('1', false)).rejects.toThrow(BadRequestException);
        });
    });

    describe('getProductByIds', () => {
        it('should return products by ids', async () => {
            productRepo.findProductsByIds.mockResolvedValue([{ id: '1' }, { id: '2' }]);
            const result = await productService.getProductByIds(['1', '2'], true);
            expect(result.length).toBe(2);
        });

        it('should throw if ids are empty', async () => {
            await expect(productService.getProductByIds([], true)).rejects.toThrow(BadRequestException);
        });
    });

    describe('searchProductByName', () => {
        it('should return matching products', async () => {
            productRepo.searchByName.mockResolvedValue([{ id: '1', name: 'ABC' }]);
            const result = await productService.searchProductByName('A', true);
            expect(result[0].name).toContain('A');
        });

        it('should throw if name is empty', async () => {
            await expect(productService.searchProductByName('', true)).rejects.toThrow(BadRequestException);
        });
    });

    describe('getTopSellerProducts', () => {
        it('should return bestseller products', async () => {
            productRepo.findTopSellers.mockResolvedValue([{ id: '1', isBestSeller: true }]);
            const result = await productService.getTopSellerProducts(true);
            expect(result[0].isBestSeller).toBe(true);
        });
    });
});
