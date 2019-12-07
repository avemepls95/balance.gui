import { PositionDto } from './PositionDto';
import { PaymentDto } from './PaymentDto';

export class CheckDto {
    title: string;
    positions: PositionDto[] = [];
    payments: PaymentDto[] = [];

    public constructor(
        fields?: {
            title?: string,
            positions?: PositionDto[],
            payments?: PaymentDto[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}