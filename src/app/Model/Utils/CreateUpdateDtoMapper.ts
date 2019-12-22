import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { CreateUpdateCheckDto } from '../Dto/Check/CreateUpdate/CreateUpdateCheckDto';
import { CreateUpdatePositionDto } from '../Dto/Check/CreateUpdate/CreateUpdatePositionDto';
import { CreateUpdateConsumptionDto } from '../Dto/Check/CreateUpdate/CreateUpdateConsumptionDto';
import { CreateUpdatePaymentDto } from '../Dto/Check/CreateUpdate/CreateUpdatePaymentDto';

export class CreateUpdateDtoMapper {

    static convertCheckToDto(check: Check): CreateUpdateCheckDto {
        return new CreateUpdateCheckDto({
            id: check.id,
            title: check.title,
            positions: CreateUpdateDtoMapper.convertPositionToDto(check.positions),
            payments: CreateUpdateDtoMapper.convertPaymentToDto(check.payments),
        })
    }

    static convertPositionToDto(positions: Position[]): CreateUpdatePositionDto[] {
        return positions.map(p => new CreateUpdatePositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.users.map(u => new CreateUpdateConsumptionDto({
                amount: 1,
                userId: u.id
            }))
        }));
    }

    static convertPaymentToDto(payments: Payment[]): CreateUpdatePaymentDto[] {
        return payments.map(p => new CreateUpdatePaymentDto({
            amount: p.amount,
            userId: p.user.id
        }));
    }

    // static convertDtoToCheck(checkDto: CreateUpdateCheckDto): Check {
    //     return new Check({
    //         id: checkDto.id,
    //         title: checkDto.title,
    //         positions: CreateUpdateDtoMapper.convertDtoToPosition(checkDto.positions),
    //         payments: CreateUpdateDtoMapper.convertDtoToPayment(checkDto.payments),
    //     })
    // }

    // static convertDtoToPosition(positionDtoArray: CreateUpdatePositionDto[]): Position[] {
    //     return positionDtoArray.map(p => new Position({
    //         title: p.title,
    //         amount: p.amount,
    //         users: p.consumptions.map(c => new User({ id: c.user.id, username: c.user.username }))
    //     }));
    // }

    // static convertDtoToPayment(paymentDtoArray: CreateUpdatePaymentDto[]): Payment[] {
    //     return paymentDtoArray.map(p => new Payment({
    //         amount: p.amount,
    //         user: new User({ id: p.user.id, username: p.user.username })
    //     }))
    // }
}