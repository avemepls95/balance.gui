import { UserDto } from './Dto/UserDto';

export class ConsumptionDto {
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