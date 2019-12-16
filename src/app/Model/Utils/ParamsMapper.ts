import { TelegramAuthDto } from "../Dto/TelegramAuthDto";
import { VkAuthDto } from '../Dto/VkAuthDto';
import { CheckDto } from '../Dto/CheckDto';
import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { PaymentDto } from '../Dto/PaymentDto';
import { PositionDto } from '../Dto/PositionDto';
import { ConsumptionDto } from '../Consumption';
import { User } from '../User';

export class ParamsMapper {
    static getTelegramAuthDto(loginData) {
        return new TelegramAuthDto({
            authDate: loginData.auth_date,
            firstName: loginData.first_name,
            hash: loginData.hash,
            userId: loginData.id,
            lastName: loginData.last_name,
            photoUrl: loginData.photo_url,
            username: loginData.user_name
        });
    }

    static getVkAuthDto(loginData) {
        return new VkAuthDto({
            firstName: loginData.first_name,
            hash: loginData.hash,
            uid: loginData.uid,
            lastName: loginData.last_name,
            photoRec: loginData.photo_rec,
            photo: loginData.photo,
        });
    }

    static convertCheckToCheckDto(check: Check): CheckDto {
        return new CheckDto({
            id: check.id,
            title: check.title,
            positions: ParamsMapper.convertPositionToPositionDto(check.positions),
            payments: ParamsMapper.convertPaymentToPaymentDto(check.payments),
        })
    }

    static convertPositionToPositionDto(positions: Position[]): PositionDto[] {
        return positions.map(p => new PositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.users.map(u => new ConsumptionDto({
                amount: 1,
                user: new User({ id: u.id, username: u.username })
            }))
        }));
    }

    static convertPaymentToPaymentDto(payments: Payment[]): PaymentDto[] {
        return payments.map(p => new PaymentDto({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }));
    }

    static convertCheckDtoToCheck(checkDto: CheckDto): Check {
        return new Check({
            id: checkDto.id,
            title: checkDto.title,
            positions: ParamsMapper.convertPositionDtoToPosition(checkDto.positions),
            payments: ParamsMapper.convertPaymentDtoToPayment(checkDto.payments),
        })
    }

    static convertPositionDtoToPosition(positionDtoArray: PositionDto[]): Position[] {
        return positionDtoArray.map(p => new Position({
            title: p.title,
            amount: p.amount,
            users: p.consumptions.map(c => new User({ id: c.user.id, username: c.user.username }))
        }));
    }

    static convertPaymentDtoToPayment(paymentDtoArray: PaymentDto[]): Payment[] {
        return paymentDtoArray.map(p => new Payment({
            amount: p.amount,
            user: new User({ id: p.user.id, username: p.user.username })
        }))
    }
}