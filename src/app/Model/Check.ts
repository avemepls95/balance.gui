import { Payment } from './Payment';
import { Position } from 'src/app/Model/Position';
import { Discount } from './Discount/discount';
import { MathExtensions } from '../Utils/MathExtensions';
import { DISCOUNT_TYPE } from './Discount/discount-type.enum';

export class Check {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: Position[] = [];
    payments: Payment[] = [];
    createdAt: Date;
    roles: string[];
    discount: Discount = new Discount();

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess: boolean,
            positions?: Position[],
            payments?: Payment[],
            createdAt?: Date,
            roles?: string[],
            discount: Discount;
        }) {
        if (fields) Object.assign(this, fields);
    }
}