import { UserDto } from 'src/app/Common/Contracts/UserDto';

export class ExecutionUnitDto {
  assignee: UserDto;
  resultKey: string;
  comment: string;
}
