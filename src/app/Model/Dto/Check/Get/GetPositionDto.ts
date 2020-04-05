import { GetConsumptionDto } from './GetConsumptionDto';

export class GetPositionDto {
    amount: number;
    title: string;
    consumptions: GetConsumptionDto[];
    applyDiscount: boolean;

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: GetConsumptionDto[],
            applyDiscount?: boolean
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}