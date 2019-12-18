import { GetConsumptionDto } from './GetConsumptionDto';

export class GetPositionDto {
    amount: number;
    title: string;
    consumptions: GetConsumptionDto[];

    public constructor(
        fields?: {
            amount?: number,
            title?: string,
            consumptions?: GetConsumptionDto[]
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}