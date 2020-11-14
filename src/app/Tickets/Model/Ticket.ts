import { User } from '../../Common/Model/User';
import { UUID } from 'angular2-uuid';

export class Ticket {
    id: UUID;
    title: string;
    authorUserName: string;
    description: string;
    deadline: Date;
    deadlineViolation: boolean;
    statusKey: string;
    createdDate: Date;
    modifiedDate: Date;
    assignees: User[] = [];
    canEdit: boolean;
    canAssign: boolean;
    canClose: boolean;
    canReopen: boolean;

    public constructor(
        fields?: {
            id?: UUID,
            title?: string,
            authorUserName: string,
            description?: string,
            deadline: Date,
            deadlineViolation: boolean,
            statusKey: string,
            createdDate?: Date,
            modifiedDate?: Date,
            assignees?: User[],
            canEdit?: boolean,
            canAssign?: boolean,
            canClose?: boolean,
            canReopen?: boolean,
        }) {
        if (fields)
          Object.assign(this, fields);
    }
}
