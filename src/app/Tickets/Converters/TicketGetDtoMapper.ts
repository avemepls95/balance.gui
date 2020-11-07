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
            status: ticketDto.status,
            createdDate: new Date(ticketDto.createdDate),
            modifiedDate: new Date(ticketDto.modifiedDate),
            assignees: ticketDto.assignees.map(a => new User({
                id: a.id,
                username: a.username
            }))
        })
    }

    static convertDtoToTicketListModel(ticketDto: GetTicketDto): Ticket {
        return new Ticket({
            id: ticketDto.id,
            title: ticketDto.title,
            authorUserName: ticketDto.authorUserName,
            deadline: ticketDto.deadline,
            deadlineViolation: ticketDto.deadlineViolation,
            description: ticketDto.description,
            status: ticketDto.status,
            createdDate: new Date(ticketDto.createdDate)
        })
    }
}