import { UUID } from "angular2-uuid";

export class GetTicketGridDto {
  id: UUID;
  title: string;
  authorUserName: string;
  description: string;
  statusKey: string;
  deadline: Date;
  deadlineViolation: boolean;
  createdDate: Date;
  canDelete: boolean;

  public constructor(fields?: {
    id?: number;
    title?: string;
    authorUserName: string;
    statusKey: string;
    deadline: Date;
    deadlineViolation: boolean;
    createdAt?: Date;
    modifiedDate?: Date;
    canDelete?: boolean;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
