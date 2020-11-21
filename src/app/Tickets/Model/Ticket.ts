import { UUID } from 'angular2-uuid';
import { ExecutionUnit } from './ExecutionUnit';

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
    executionUnits: ExecutionUnit[] = [];
    canEdit: boolean;
    canDelete: boolean;
    statusPermissions: string[] = [];

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
            canEdit?: boolean,
            canDelete?: boolean,
            executionUnits?: ExecutionUnit[],
            statusPermissions?: string[]
        }) {
        if (fields)
          Object.assign(this, fields);
    }
}
