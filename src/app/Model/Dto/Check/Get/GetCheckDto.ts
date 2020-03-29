import { GetPositionDto } from './GetPositionDto';
import { GetPaymentDto } from './GetPaymentDto';

export class GetCheckDto {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: GetPositionDto[] = [];
    payments: GetPaymentDto[] = [];
    createdAt: Date;
    roles: string[];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess?: boolean,
            positions?: GetPositionDto[],
            payments?: GetPaymentDto[],
            createdAt?: Date,
            roles?: string[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}