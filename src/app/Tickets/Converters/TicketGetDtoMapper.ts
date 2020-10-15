import { User } from 'src/app/Common/Model/User';
import { GetTicketDto } from '../Contracts/Get/GetTicketDto';
import { Ticket } from '../Model/Ticket';


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