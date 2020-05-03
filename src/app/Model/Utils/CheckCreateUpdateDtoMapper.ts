import { Check } from '../Check';
import { Payment } from '../Payment';
import { CreateUpdateCheckDto } from '../Dto/Check/CreateUpdate/CreateUpdateCheckDto';
import { CreateUpdatePositionDto } from '../Dto/Check/CreateUpdate/CreateUpdatePositionDto';
import { CreateUpdateConsumptionDto } from '../Dto/Check/CreateUpdate/CreateUpdateConsumptionDto';
import { CreateUpdatePaymentDto } from '../Dto/Check/CreateUpdate/CreateUpdatePaymentDto';
import { PositionDiscountDto } from '../Dto/Check/position-discount-dto';
import { POSITION_DISCOUNT_TYPE_DTO } from '../Dto/Check/position-discount-type-dto';
import { DiscountTypeDtoMapper } from './DiscountDtoMapper';
import { DISCOUNT_TYPE_DTO } from '../Dto/Check/discount-type-dto.enum';
import { CheckDiscountDto } from '../Dto/Check/check-discount-dto';

export class CheckCreateUpdateDtoMapper {

    static convertCheckToDto(check: Check): CreateUpdateCheckDto {
        return new CreateUpdateCheckDto({
            id: check.id,
            title: check.title,
            positions: CheckCreateUpdateDtoMapper.convertPositionToDto(check),
            payments: CheckCreateUpdateDtoMapper.convertPaymentToDto(check.payments),
            discount: new CheckDiscountDto({
                type: DISCOUNT_TYPE_DTO[DiscountTypeDtoMapper.convertTypeToDto(check.discount.type)],
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
                value: check.discount.value
            })
        }));
    }

    static convertPaymentToDto(payments: Payment[]): CreateUpdatePaymentDto[] {
        return payments.map(p => new CreateUpdatePaymentDto({
            amount: p.amount,
            userId: p.user.id
        }));
    }
}