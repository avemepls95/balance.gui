import { CreateUpdatePaymentDto } from './CreateUpdatePaymentDto';
import { CreateUpdatePositionDto } from './CreateUpdatePositionDto';
import { DiscountDto } from '../../DiscountDto';

export class CreateUpdateCheckDto {
    id: number;
    title: string;
    positions: CreateUpdatePositionDto[] = [];
    payments: CreateUpdatePaymentDto[] = [];
    discount: DiscountDto;

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            positions?: CreateUpdatePositionDto[],
            payments?: CreateUpdatePaymentDto[],
            discount?: DiscountDto
        }) {
        if (fields) Object.assign(this, fields);
    }
}