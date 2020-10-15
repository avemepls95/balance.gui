import { UserDto } from 'src/app/Common/Contracts/UserDto';

export class DebtDto {
    user: UserDto;
    value: number;

    public constructor(
        fields?: {
            user?: UserDto,
            value?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}