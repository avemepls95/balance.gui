import { EXECUTION_UNIT_RESULT } from './ExecutionUnitResult';
import { User } from 'src/app/Common/Model/User';

export class ExecutionUnit {
  assignee: User;
  result: EXECUTION_UNIT_RESULT;
  comment: string;

  public constructor(fields?: {
    assignee?: User;
    result?: EXECUTION_UNIT_RESULT;
    comment?: string;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
