import { UUID } from 'angular2-uuid';
import { UserDto } from 'src/app/Common/Contracts/UserDto';

export class GetTicketDto {
    id: UUID;
    title: string;
    authorUserName: string;
    description: string;
    status: string;
    deadline: Date;
    deadlineViolation: boolean;
    createdDate: Date;
    modifiedDate: Date;
    assignees: UserDto[];

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            authorUserName: string,
            status: string,
            deadline: Date,
            deadlineViolation: boolean,
            createdAt?: Date,
            modifiedDate?: Date,
            roles?: string[],
        }) {
        if (fields) Object.assign(this, fields);
    }
}