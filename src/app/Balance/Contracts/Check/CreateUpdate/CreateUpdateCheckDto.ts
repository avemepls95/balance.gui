import { CreateUpdatePaymentDto } from './CreateUpdatePaymentDto';
import { CreateUpdatePositionDto } from './CreateUpdatePositionDto';
import { CheckDiscountDto } from '../check-discount-dto';

export class CreateUpdateCheckDto {
    id: number;
    title: string;
    positions: CreateUpdatePositionDto[] = [];
    payments: CreateUpdatePaymentDto[] = [];
    discount: CheckDiscountDto;

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            positions?: CreateUpdatePositionDto[],
            payments?: CreateUpdatePaymentDto[],
            discount?: CheckDiscountDto
        }) {
        if (fields) Object.assign(this, fields);
    }
}