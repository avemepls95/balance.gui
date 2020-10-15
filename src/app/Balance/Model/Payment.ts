import { User } from 'src/app/Common/Model/User';

export class Payment {
    internalId: number;
    amount: number;
    user: User;

    public constructor(
        fields?: {
            internalId?: number;
            amount?: number,
            user?: User
        }) {
        if (fields) Object.assign(this, fields);
    }
}