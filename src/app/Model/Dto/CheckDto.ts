import { PositionDto } from './PositionDto';
import { PaymentDto } from './PaymentDto';

export class CheckDto {
    id: number;
    title: string;
    positions: PositionDto[] = [];
    payments: PaymentDto[] = [];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            positions?: PositionDto[],
            payments?: PaymentDto[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}