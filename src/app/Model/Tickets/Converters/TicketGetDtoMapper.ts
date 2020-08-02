import { Ticket } from '../ticket';
import { GetTicketDto } from '../Dto/Get/GetTicketDto';
import { User } from '../../User';

export class TicketGetDtoMapper {

    static convertDtoToTicket(ticketDto: GetTicketDto): Ticket {
        return new Ticket({
            id: ticketDto.id,
            title: ticketDto.title,
            deadline: ticketDto.deadline,
            description: ticketDto.description,
            status: ticketDto.status,
            createdDate: new Date(ticketDto.createdDate),
            assignees: ticketDto.assignees.map(a => new User({
                id: a.id,
                username: a.username
            }))
        })
    }
}