import { Payment } from './Payment';
import { Position } from 'src/app/Model/Position';

export class Check {
    title: string;
    positions: Position[] = [];
    payments: Payment[] = [];

    public constructor(
        fields?: {
            title?: string,
            positions?: Position[],
            payments?: Payment[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}