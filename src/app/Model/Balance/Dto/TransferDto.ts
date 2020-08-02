import { UUID } from 'angular2-uuid';

export class TransferDto {
    id: UUID;
    recipientId: number;
    amount: number;
    description: string;

    public constructor(
        fields?: {
            id: UUID
            recipientId: number,
            amount: number,
            description?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}