import { BadRequestException } from '@nestjs/common';

import { validateProductType } from '../../common/validation';
import { ProductType } from '../../models/product/product.entity';


describe('validateProductType', () => {
    it('should not throw if type is valid', () => {
        expect(() => validateProductType(ProductType.FURNITURE)).not.toThrow();
    });

    it('should throw if type is not provided', () => {
        expect(() => validateProductType('')).toThrow(BadRequestException);
    });

    it('should throw if type is invalid', () => {
        expect(() => validateProductType('INVALID_TYPE')).toThrow(BadRequestException);
    });
});
