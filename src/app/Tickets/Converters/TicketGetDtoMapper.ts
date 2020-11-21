import { PermissionsDto as TicketPermissionsDto } from './../Contracts/Get/PermissionsDto';
import { ExecutionUnitDto } from './../Contracts/Get/ExecutionUnitDto';
import { EXECUTION_UNIT_RESULT } from './../Model/ExecutionUnitResult';
import { ExecutionUnit } from './../Model/ExecutionUnit';
import { User } from 'src/app/Common/Model/User';
import { GetTicketDto } from '../Contracts/Get/GetTicketDto';
import { Ticket } from '../Model/Ticket';
import { GetTicketGridDto } from '../Contracts/Get/GetTicketGridDto';


export class TicketGetDtoMapper {

    static convertDtoToTicket(ticketDto: GetTicketDto): Ticket {
        return new Ticket({
            id: ticketDto.id,
            title: ticketDto.title,
            authorUserName: ticketDto.authorUserName,
            deadline: ticketDto.deadline,
            deadlineViolation: ticketDto.deadlineViolation,
            description: ticketDto.description,
            statusKey: ticketDto.statusKey,
            createdDate: new Date(ticketDto.createdDate),
            modifiedDate: new Date(ticketDto.modifiedDate),
            executionUnits: TicketGetDtoMapper.convertDtoToExecutionUnits(ticketDto.executionUnits),
            canEdit: ticketDto.permissions.canEdit,
            statusPermissions: TicketGetDtoMapper.convertToStatusPermissions(ticketDto.permissions)
        });
    }

    private static convertToStatusPermissions(permissionsDto: TicketPermissionsDto): string[] {
      const result = [];
      if (permissionsDto.canAssign) result.push('canAssign');
      if (permissionsDto.canReopen) result.push('canReopen');
      if (permissionsDto.canClose) result.push('canClose');
      if (permissionsDto.canComplete) result.push('canComplete');
      if (permissionsDto.canCancel) result.push('canCancel');
      if (permissionsDto.canDecline) result.push('canDecline');
      if (permissionsDto.canCancelUnitResult) result.push('canCancelUnitResult');

      return result;
    }

    static convertDtoToExecutionUnits(executionUnitDto: ExecutionUnitDto[]) {
        return executionUnitDto.map(u => new ExecutionUnit({
          assignee: new User({
            id: u.assignee.id,
            username: u.assignee.username
          }),
          result: EXECUTION_UNIT_RESULT[u.resultKey] as EXECUTION_UNIT_RESULT,
          comment: u.comment
        }));
    }

    static convertDtoToTicketListModel(ticketDto: GetTicketGridDto): Ticket {
        return new Ticket({
            id: ticketDto.id,
            title: ticketDto.title,
            authorUserName: ticketDto.authorUserName,
            deadline: ticketDto.deadline,
            deadlineViolation: ticketDto.deadlineViolation,
            description: ticketDto.description,
            statusKey: ticketDto.statusKey,
            createdDate: new Date(ticketDto.createdDate),
            canEdit: ticketDto.canEdit
        });
    }
}
