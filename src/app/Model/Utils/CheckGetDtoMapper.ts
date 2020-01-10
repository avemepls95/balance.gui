import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { User } from '../User';
import { GetCheckDto } from '../Dto/Check/Get/GetCheckDto';
import { GetPositionDto } from '../Dto/Check/Get/GetPositionDto';
import { GetConsumptionDto } from '../Dto/Check/Get/GetConsumptionDto';
import { GetPaymentDto } from '../Dto/Check/Get/GetPaymentDto';
import { Consumption } from '../Consumption';

export class CheckGetDtoMapper {
    static convertCheckToDto(check: Check): GetCheckDto {
        return new GetCheckDto({
            id: check.id,
            title: check.title,
            positions: CheckGetDtoMapper.convertPositionToDto(check.positions),
            payments: CheckGetDtoMapper.convertPaymentToDto(check.payments),
        })
    }

    static convertPositionToDto(positions: Position[]): GetPositionDto[] {
        return positions.map(p => new GetPositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.consumptions.map(u => new GetConsumptionDto({
                amount: 1,
                user: u.user
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
            isReadyForProcess: checkDto.isReadyForProcess,
            positions: CheckGetDtoMapper.convertDtoToPosition(checkDto.positions),
            payments: CheckGetDtoMapper.convertDtoToPayment(checkDto.payments),
        })
    }

    static convertDtoToPosition(positionDtoArray: GetPositionDto[]): Position[] {
        return positionDtoArray.map(p => new Position({
            title: p.title,
            amount: p.amount,
            consumptions: p.consumptions.map(c =>
                new Consumption({
                    amount: c.amount,
                    user: c.user
                })
            )
        }));
    }

    static convertDtoToPayment(paymentDtoArray: GetPaymentDto[]): Payment[] {
        return paymentDtoArray.map(p => new Payment({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }))
    }
}