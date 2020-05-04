import { GetConsumptionDto } from './GetConsumptionDto';
import { PositionDiscountDto } from '../position-discount-dto';

export class GetPositionDto {
    amount: number;
    title: string;
    consumptions: GetConsumptionDto[];
    discount: PositionDiscountDto

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: GetConsumptionDto[],
            applyDiscount?: boolean,
            discount?: PositionDiscountDto
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}