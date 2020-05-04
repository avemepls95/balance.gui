import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { User } from '../User';
import { GetCheckDto } from '../Dto/Check/Get/GetCheckDto';
import { GetPositionDto } from '../Dto/Check/Get/GetPositionDto';
import { GetPaymentDto } from '../Dto/Check/Get/GetPaymentDto';
import { Consumption } from '../Consumption';
import { Discount } from '../Discount/discount';
import { DISCOUNT_TYPE_DTO } from '../Dto/Check/discount-type-dto.enum';
import { DISCOUNT_TYPE } from '../Discount/discount-type.enum';
import { CheckDiscountDto } from '../Dto/Check/check-discount-dto';

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
            discount: this.convertDtoToDiscount(checkDto.discount)
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
            applyDiscount: !!p.discount && p.discount.value > 0
        }));
    }

    static convertDtoToPayment(paymentDtoArray: GetPaymentDto[]): Payment[] {
        return paymentDtoArray.map(p => new Payment({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }))
    }

    static convertDtoToDiscount(discountDto: CheckDiscountDto) : Discount {
        return discountDto ? new Discount({
            apply: discountDto.value != 0,
            type: this.convertDtoToDiscountType(DISCOUNT_TYPE_DTO[discountDto.type]),
            value: discountDto.value
        }) : new Discount({
            apply: false,
            type: DISCOUNT_TYPE.PERCENT,
            value: 0
        })
    }

    static convertDtoToDiscountType(discountType: DISCOUNT_TYPE_DTO): DISCOUNT_TYPE {
        return discountType == DISCOUNT_TYPE_DTO.ABSOLUTE ?
            DISCOUNT_TYPE.ABSOLUTE : DISCOUNT_TYPE.PERCENT;
    }
}