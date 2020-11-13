import { UUID } from 'angular2-uuid';
import { UserDto } from 'src/app/Common/Contracts/UserDto';

export class GetTicketDto {
    id: UUID;
    title: string;
    authorUserName: string;
    description: string;
    statusKey: string;
    deadline: Date;
    deadlineViolation: boolean;
    createdDate: Date;
    modifiedDate: Date;
    assignees: UserDto[];
    canEdit: boolean;

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            authorUserName: string,
            statusKey: string,
            deadline: Date,
            deadlineViolation: boolean,
            createdAt?: Date,
            modifiedDate?: Date,
            roles?: string[],
            canEdit?: boolean
        }) {
        if (fields) Object.assign(this, fields);
    }
}
