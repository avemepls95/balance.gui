import { User } from './User';
import { Consumption } from './Consumption';

export class Position {
    internalId: number;
    id: number;
    amount: number;
    title: string;
    consumptions: Consumption[];

    public constructor(
        fields?: {
            internalId?: number;
            id?: number,
            amount?: number,
            title?: string,
            consumptions?: Consumption[]
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}