import { GetPositionDto } from './GetPositionDto';
import { GetPaymentDto } from './GetPaymentDto';
import { CheckDiscountDto } from '../check-discount-dto';

export class GetCheckDto {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: GetPositionDto[] = [];
    payments: GetPaymentDto[] = [];
    createdAt: Date;
    roles: string[];
    discount: CheckDiscountDto;

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess?: boolean,
            positions?: GetPositionDto[],
            payments?: GetPaymentDto[],
            createdAt?: Date,
            roles?: string[],
            discount? : CheckDiscountDto
        }) {
        if (fields) Object.assign(this, fields);
    }
}