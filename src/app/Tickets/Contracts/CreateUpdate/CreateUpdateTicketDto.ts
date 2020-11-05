import { UUID } from 'angular2-uuid';

export class CreateUpdateTicketDto {
    id: UUID;
    title: string;
    description: string;
    createdDate: Date;
    modifiedDate: Date;
    deadline: Date;
    assigneeIds: number[]

    public constructor(
        fields?: {
            id: UUID,
            title: string,
            description: string,
            deadline: Date,
            assigneeIds: number[],
            modifiedDate: Date
        }) {
        if (fields) Object.assign(this, fields);
    }
}