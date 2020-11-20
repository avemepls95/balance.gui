import { CreateUpdateTicketDto } from '../Contracts/CreateUpdate/CreateUpdateTicketDto';
import { Ticket } from '../Model/Ticket';

export class TicketCreateUpdateDtoMapper {

    static convertTicketToDto(ticket: Ticket): CreateUpdateTicketDto {
        return new CreateUpdateTicketDto({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            deadline: ticket.deadline,
            assigneeIds: ticket.executionUnits.map(a => a.assignee.id),
            modifiedDate: ticket.modifiedDate
        });
    }
}
