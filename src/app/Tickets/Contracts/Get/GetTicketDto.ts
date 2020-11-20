import { UUID } from 'angular2-uuid';
import { ExecutionUnitDto } from './ExecutionUnitDto';

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
    executionUnits: ExecutionUnitDto[] = [];
    canEdit: boolean;
    canAssign: boolean;
    canClose: boolean;
    canReopen: boolean;
    canApplyExecutionUnitResult: boolean;

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
            executionUnits?: ExecutionUnitDto[],
            canEdit?: boolean
            canAssign?: boolean,
            canClose?: boolean,
            canReopen?: boolean,
            canApplyExecutionUnitResult?: boolean,
        }) {
        if (fields)
          Object.assign(this, fields);
    }
}
