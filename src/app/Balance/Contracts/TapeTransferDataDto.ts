import { UUID } from 'angular2-uuid';
import { UserDto } from 'src/app/Common/Contracts/UserDto';

export class TapeTransferDataDto {
    transferId: UUID;
    sender: UserDto;
    recipient: UserDto;
    amount: number;

    public constructor(
        fields?: {
            transferId?: UUID,
            sender?: UserDto,
            recipient?: UserDto,
            amount?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}