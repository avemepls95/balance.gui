import { User } from 'src/app/Common/Model/User';

export class Debt {
    user: User;
    amount: number;

    public constructor(
        fields?: {
            user?: User,
            amount?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}