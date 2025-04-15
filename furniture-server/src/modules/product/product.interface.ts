import { FindOperator } from 'typeorm';


export interface IWhereCondition {
    page?: number;
    maxPage?: number;
    category?: { id: string };
    price?: FindOperator<number> ;
}