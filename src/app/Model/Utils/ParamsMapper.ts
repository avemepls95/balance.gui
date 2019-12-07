import { TelegramAuthDto } from "../Dto/TelegramAuthDto";
import { VkAuthDto } from '../Dto/VkAuthDto';
import { CheckDto } from '../Dto/CheckDto';
import { Check } from '../Check';
import { Payment } from '../Payment';
import { Position } from '../Position';
import { PaymentDto } from '../Dto/PaymentDto';
import { PositionDto } from '../Dto/PositionDto';
import { ConsumptionDto } from '../Consumption';

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
        var data = new CheckDto({
            title: check.title,
            positions: ParamsMapper.convertPositionToPositionDto(check.positions),
            payments: ParamsMapper.convertPaymentToPaymentDto(check.payments),
        })
        return data;
    }

    static convertPositionToPositionDto(positions: Position[]): PositionDto[] {
        return positions.map(p => new PositionDto({
            title: p.title,
            amount: p.amount,
            consumptions: p.users.map(u => new ConsumptionDto({
                amount: 1,
                userId: u.id
            }))
        }));
    }

    static convertPaymentToPaymentDto(payments: Payment[]): PaymentDto[] {
        return payments.map(p => new PaymentDto({
            amount: p.amount,
            userId: p.user.id
        }));
    }
}