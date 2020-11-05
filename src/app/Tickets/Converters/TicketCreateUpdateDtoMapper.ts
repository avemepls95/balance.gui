import { CreateUpdateTicketDto } from '../Contracts/CreateUpdate/CreateUpdateTicketDto';
import { Ticket } from '../Model/Ticket';

export class TicketCreateUpdateDtoMapper {
    
    static convertTicketToDto(ticket: Ticket): CreateUpdateTicketDto {
        return new CreateUpdateTicketDto({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            deadline: ticket.deadline,
            assigneeIds: ticket.assignees.map(a => a.id),
            modifiedDate: ticket.modifiedDate
        })
    }
}