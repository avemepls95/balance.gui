import { UUID } from 'angular2-uuid';

export class DebtRepaidDto {
    id: UUID;
    debtorId: number;
    amount: number;
    description: string;

    public constructor(
        fields?: {
            id: UUID
            debtorId: number,
            amount: number,
            description?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}