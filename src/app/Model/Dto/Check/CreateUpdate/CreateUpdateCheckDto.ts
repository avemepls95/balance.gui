import { CreateUpdatePaymentDto } from './CreateUpdatePaymentDto';
import { CreateUpdatePositionDto } from './CreateUpdatePositionDto';

export class CreateUpdateCheckDto {
    id: number;
    title: string;
    positions: CreateUpdatePositionDto[] = [];
    payments: CreateUpdatePaymentDto[] = [];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            positions?: CreateUpdatePositionDto[],
            payments?: CreateUpdatePaymentDto[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}