import { OrderEntity } from '../../../models/order/order.entity';

export interface IOrdersGroupedByStatus {
    [status: string]: OrderEntity[];
}