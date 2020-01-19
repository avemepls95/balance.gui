import { Payment } from './Payment';
import { Position } from 'src/app/Model/Position';

export class Check {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: Position[] = [];
    payments: Payment[] = [];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess: boolean,
            positions?: Position[],
            payments?: Payment[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}