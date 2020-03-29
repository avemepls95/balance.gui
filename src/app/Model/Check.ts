import { Payment } from './Payment';
import { Position } from 'src/app/Model/Position';

export class Check {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: Position[] = [];
    payments: Payment[] = [];
    createdAt: Date;
    roles: string[];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess: boolean,
            positions?: Position[],
            payments?: Payment[],
            createdAt?: Date,
            roles?: string[];
        }) {
        if (fields) Object.assign(this, fields);
    }
}