import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { CreateUpdateCheckDto } from '../Dto/Check/CreateUpdate/CreateUpdateCheckDto';
import { CreateUpdatePositionDto } from '../Dto/Check/CreateUpdate/CreateUpdatePositionDto';
import { CreateUpdateConsumptionDto } from '../Dto/Check/CreateUpdate/CreateUpdateConsumptionDto';
import { CreateUpdatePaymentDto } from '../Dto/Check/CreateUpdate/CreateUpdatePaymentDto';
import { DiscountDto } from '../Dto/DiscountDto';

export class CheckCreateUpdateDtoMapper {

    static convertCheckToDto(check: Check): CreateUpdateCheckDto {
        return new CreateUpdateCheckDto({
            id: check.id,
            title: check.title,
            positions: CheckCreateUpdateDtoMapper.convertPositionToDto(check.positions),
            payments: CheckCreateUpdateDtoMapper.convertPaymentToDto(check.payments),
            discount: new DiscountDto({
                type: check.discount.type,
                value: check.discount.value
            })
        })
    }

    static convertPositionToDto(positions: Position[]): CreateUpdatePositionDto[] {
        return positions.map(p => new CreateUpdatePositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.consumptions.map(c => new CreateUpdateConsumptionDto({
                amount: c.amount,
                userId: c.user.id
            })),
            applyDiscount: p.applyDiscount
        }));
    }

    static convertPaymentToDto(payments: Payment[]): CreateUpdatePaymentDto[] {
        return payments.map(p => new CreateUpdatePaymentDto({
            amount: p.amount,
            userId: p.user.id
        }));
    }
}