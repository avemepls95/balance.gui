import { User } from '../../Common/Model/User';
import { UUID } from 'angular2-uuid';

export class Ticket {
    id: UUID;
    title: string;
    authorUserName: string;
    description: string;
    deadline: Date;
    deadlineViolation: boolean;
    status: string;
    createdDate: Date;
    modifiedDate: Date;
    assignees: User[] = [];

    public constructor(
        fields?: {
            id?: UUID,
            title?: string,
            authorUserName: string,
            description?: string,
            deadline: Date,
            deadlineViolation: boolean,
            status: string,
            createdDate?: Date,
            modifiedDate?: Date,
            assignees?: User[],
        }) {
        if (fields) Object.assign(this, fields);
    }
}