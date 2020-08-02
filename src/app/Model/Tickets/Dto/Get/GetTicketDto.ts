import { UUID } from 'angular2-uuid';
import { UserDto } from 'src/app/Model/Balance/Dto/UserDto';

export class GetTicketDto {
    id: UUID;
    title: string;
    description: string;
    status: string;
    deadline: Date;
    createdDate: Date;
    assignees: UserDto[];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            status: string,
            deadline: Date,
            createdAt?: Date,
            roles?: string[],
        }) {
        if (fields) Object.assign(this, fields);
    }
}