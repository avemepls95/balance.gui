import { Ticket } from '../ticket';
import { CreateUpdateTicketDto } from '../Dto/CreateUpdate/CreateUpdateTicketDto';

export class TicketCreateUpdateDtoMapper {
    
    static convertTicketToDto(ticket: Ticket): CreateUpdateTicketDto {
        return new CreateUpdateTicketDto({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            deadline: ticket.deadline,
            assigneeIds: ticket.assignees.map(a => a.id)
        })
    }
}