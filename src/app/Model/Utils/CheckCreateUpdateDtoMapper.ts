import { Check } from '../Check';
import { Payment } from '../Payment';
import { CreateUpdateCheckDto } from '../Dto/Check/CreateUpdate/CreateUpdateCheckDto';
import { CreateUpdatePositionDto } from '../Dto/Check/CreateUpdate/CreateUpdatePositionDto';
import { CreateUpdateConsumptionDto } from '../Dto/Check/CreateUpdate/CreateUpdateConsumptionDto';
import { CreateUpdatePaymentDto } from '../Dto/Check/CreateUpdate/CreateUpdatePaymentDto';
import { PositionDiscountDto } from '../Dto/Check/position-discount-dto';
import { POSITION_DISCOUNT_TYPE_DTO } from '../Dto/Check/position-discount-type-dto';
import { DISCOUNT_TYPE_DTO } from '../Dto/Check/discount-type-dto.enum';
import { CheckDiscountDto } from '../Dto/Check/check-discount-dto';
import { DISCOUNT_TYPE } from '../Discount/discount-type.enum';

export class CheckCreateUpdateDtoMapper {

    static convertCheckToDto(check: Check): CreateUpdateCheckDto {
        return new CreateUpdateCheckDto({
            id: check.id,
            title: check.title,
            positions: CheckCreateUpdateDtoMapper.convertPositionToDto(check),
            payments: CheckCreateUpdateDtoMapper.convertPaymentToDto(check.payments),
            discount: new CheckDiscountDto({
                type: DISCOUNT_TYPE_DTO[this.convertDiscountTypeToDto(check.discount.type)],
                value: check.discount.value
            })
        })
    }

    static convertPositionToDto(check: Check): CreateUpdatePositionDto[] {
        return check.positions.map(p => new CreateUpdatePositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.consumptions.map(c => new CreateUpdateConsumptionDto({
                amount: c.amount,
                userId: c.user.id
            })),
            applyDiscount: p.applyDiscount,
            discount: new PositionDiscountDto({
                type: POSITION_DISCOUNT_TYPE_DTO[POSITION_DISCOUNT_TYPE_DTO.INHERITED],
                value: p.applyDiscount ? check.discount.value : null
            })
        }));
    }

    static convertPaymentToDto(payments: Payment[]): CreateUpdatePaymentDto[] {
        return payments.map(p => new CreateUpdatePaymentDto({
            amount: p.amount,
            userId: p.user.id
        }));
    }

    static convertDiscountTypeToDto(discountType: DISCOUNT_TYPE): DISCOUNT_TYPE_DTO {
        return discountType == DISCOUNT_TYPE.ABSOLUTE ?
            DISCOUNT_TYPE_DTO.ABSOLUTE : DISCOUNT_TYPE_DTO.RELATIVE;
    }
}