import { User } from './User';

export class Consumption {
    amount: number;
    user: User;

    public constructor(
        fields?: {
            amount?: number,
            user?: User
        }) {
        if (fields) Object.assign(this, fields);
    }
}