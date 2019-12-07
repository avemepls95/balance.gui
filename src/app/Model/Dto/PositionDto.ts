import { ConsumptionDto } from '../Consumption';

export class PositionDto {
    amount: number;
    title: string;
    consumptions: ConsumptionDto[];

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: ConsumptionDto[]
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}