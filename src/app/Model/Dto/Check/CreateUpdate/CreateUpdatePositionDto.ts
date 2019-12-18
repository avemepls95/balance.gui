import { CreateUpdateConsumptionDto } from './CreateUpdateConsumptionDto';

export class CreateUpdatePositionDto {
    amount: number;
    title: string;
    consumptions: CreateUpdateConsumptionDto[];

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: CreateUpdateConsumptionDto[]
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}