import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { User } from '../User';
import { GetCheckDto } from '../Dto/Check/Get/GetCheckDto';
import { GetPositionDto } from '../Dto/Check/Get/GetPositionDto';
import { GetConsumptionDto } from '../Dto/Check/Get/GetConsumptionDto';
import { GetPaymentDto } from '../Dto/Check/Get/GetPaymentDto';

export class GetDtoMapper {
    static convertCheckToDto(check: Check): GetCheckDto {
        return new GetCheckDto({
            id: check.id,
            title: check.title,
            positions: GetDtoMapper.convertPositionToDto(check.positions),
            payments: GetDtoMapper.convertPaymentToDto(check.payments),
        })
    }

    static convertPositionToDto(positions: Position[]): GetPositionDto[] {
        return positions.map(p => new GetPositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.users.map(u => new GetConsumptionDto({
                amount: 1,
                user: new User({ id: u.id, username: u.username })
            }))
        }));
    }

    static convertPaymentToDto(payments: Payment[]): GetPaymentDto[] {
        return payments.map(p => new GetPaymentDto({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }));
    }

    static convertDtoToCheck(checkDto: GetCheckDto): Check {
        return new Check({
            id: checkDto.id,
            title: checkDto.title,
            positions: GetDtoMapper.convertDtoToPosition(checkDto.positions),
            payments: GetDtoMapper.convertDtoToPayment(checkDto.payments),
        })
    }

    static convertDtoToPosition(positionDtoArray: GetPositionDto[]): Position[] {
        return positionDtoArray.map(p => new Position({
            title: p.title,
            amount: p.amount,
            users: p.consumptions.map(c => new User({ id: c.user.id, username: c.user.username }))
        }));
    }

    static convertDtoToPayment(paymentDtoArray: GetPaymentDto[]): Payment[] {
        return paymentDtoArray.map(p => new Payment({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }))
    }
}