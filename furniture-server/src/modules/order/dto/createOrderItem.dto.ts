import {IsNumber, IsUUID} from 'class-validator';


export class CreateOrderItemDto {
    @IsUUID('4', { message: 'Product ID must be a valid UUID.' })
    productId: string;

    @IsNumber()
    quantity: number;
}
