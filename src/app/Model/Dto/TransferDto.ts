import { UUID } from 'angular2-uuid';

export class TransferDto {
    id: UUID;
    recipientId: number;
    amount: number;

    public constructor(
        fields?: {
            id?: UUID
            recipientId?: number,
            amount?: number,
        }) {
        if (fields) Object.assign(this, fields);
    }
}