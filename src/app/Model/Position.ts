import { User } from './User';

export class Position {
    internalId: number;
    id: number;
    amount: number;
    title: string;
    users: User[];

    public constructor(
        fields?: {
            internalId?: number;
            id?: number,
            amount?: number,
            title?: string,
            users?: User[]
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}