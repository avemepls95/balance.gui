import { ExecutionUnitDto } from './../Contracts/Get/ExecutionUnitDto';
import { EXECUTION_UNIT_RESULT } from './../Model/ExecutionUnitResult';
import { ExecutionUnit } from './../Model/ExecutionUnit';
import { User } from 'src/app/Common/Model/User';
import { GetTicketDto } from '../Contracts/Get/GetTicketDto';
import { Ticket } from '../Model/Ticket';


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
            canEdit: ticketDto.canEdit,
            canAssign: ticketDto.canAssign,
            canClose: ticketDto.canClose,
            canReopen: ticketDto.canReopen,
            canApplyExecutionUnitResult: ticketDto.canApplyExecutionUnitResult
        });
    }

    static convertDtoToExecutionUnits(executionUnitDto: ExecutionUnitDto[]) {
        return executionUnitDto.map(u => new ExecutionUnit({
          assignee: new User({
            id: u.assignee.id,
            username: u.assignee.username
          }),
          result: EXECUTION_UNIT_RESULT[u.resultKey] as EXECUTION_UNIT_RESULT,
          comment: u.comment
        }))
    }

    static convertDtoToTicketListModel(ticketDto: GetTicketDto): Ticket {
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
