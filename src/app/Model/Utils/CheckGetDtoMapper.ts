import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { User } from '../User';
import { GetCheckDto } from '../Dto/Check/Get/GetCheckDto';
import { GetPositionDto } from '../Dto/Check/Get/GetPositionDto';
import { GetPaymentDto } from '../Dto/Check/Get/GetPaymentDto';
import { Consumption } from '../Consumption';
import { Discount } from '../Discount/discount';

export class CheckGetDtoMapper {

    static convertDtoToCheck(checkDto: GetCheckDto): Check {
        return new Check({
            id: checkDto.id,
            title: checkDto.title,
            isReadyForProcess: checkDto.isReadyForProcess,
            state: checkDto.state,
            positions: CheckGetDtoMapper.convertDtoToPosition(checkDto.positions),
            payments: CheckGetDtoMapper.convertDtoToPayment(checkDto.payments),
            createdAt: new Date(checkDto.createdAt),
            roles: checkDto.roles,
            discount: new Discount({
                // apply: checkDto.discount.apply,
                // value: checkDto.discount.apply ? checkDto.discount.value : 0
                apply: true,
                value: 20
            })
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
            ),
            // applyDiscount: p.applyDiscount
            applyDiscount: true
        }));
    }

    static convertDtoToPayment(paymentDtoArray: GetPaymentDto[]): Payment[] {
        return paymentDtoArray.map(p => new Payment({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }))
    }
}