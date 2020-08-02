import { UserDto } from '../../UserDto';

export class GetConsumptionDto {
    amount: number;
    user: UserDto;

    public constructor(
        fields?: {
            amount?: number,
            user?: UserDto
        }) {
        if (fields) Object.assign(this, fields);
    }
}