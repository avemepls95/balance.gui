import { CreateUpdateConsumptionDto } from './CreateUpdateConsumptionDto';

export class CreateUpdatePositionDto {
    amount: number;
    title: string;
    consumptions: CreateUpdateConsumptionDto[];
    applyDiscount: boolean;

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: CreateUpdateConsumptionDto[],
            applyDiscount?: boolean
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}