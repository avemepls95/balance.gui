import { Position } from './Position';
import { Payment } from './Payment';
import { Discount } from './Discount/discount';

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