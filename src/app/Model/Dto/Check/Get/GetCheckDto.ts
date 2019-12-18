import { GetPositionDto } from './GetPositionDto';
import { GetPaymentDto } from './GetPaymentDto';

export class GetCheckDto {
    id: number;
    title: string;
    positions: GetPositionDto[] = [];
    payments: GetPaymentDto[] = [];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            positions?: GetPositionDto[],
            payments?: GetPaymentDto[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}