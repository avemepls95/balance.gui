import { UUID } from 'angular2-uuid';
import { User } from 'src/app/Common/Model/User';

export class TapeTransferData {
    transferId: UUID;
    sender: User;
    recipient: User;
    amount: number;

    public constructor(
        fields?: {
            transferId?: UUID,
            sender?: User,
            recipient?: User,
            amount?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}