import { CreateUpdateConsumptionDto } from './CreateUpdateConsumptionDto';
import { PositionDiscountDto } from '../position-discount-dto';

export class CreateUpdatePositionDto {
    amount: number;
    title: string;
    consumptions: CreateUpdateConsumptionDto[];
    applyDiscount: boolean;
    discount: PositionDiscountDto

    public constructor(
        fields?: {
            amount: number,
            title: string,
            consumptions: CreateUpdateConsumptionDto[],
            applyDiscount: boolean,
            discount: PositionDiscountDto
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}