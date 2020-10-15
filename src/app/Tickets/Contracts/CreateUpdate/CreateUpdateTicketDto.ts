import { UUID } from 'angular2-uuid';

export class CreateUpdateTicketDto {
    id: UUID;
    title: string;
    description: string;
    createdDate: Date;
    deadline: Date;
    assigneeIds: number[]

    public constructor(
        fields?: {
            id: UUID,
            title: string,
            description: string,
            deadline: Date,
            assigneeIds: number[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}