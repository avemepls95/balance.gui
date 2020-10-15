import { FromTelegramAuthDto } from '../Contracts/Auth/FromTelegramAuthDto';
import { FromVkAuthDto } from '../Contracts/Auth/FromVkAuthDto';
import { TelegramToBalanceAuthDto } from '../Contracts/Auth/TelegramToBalanceAuthDto';
import { VkToBalanceAuthDto } from '../Contracts/Auth/VkToBalanceAuthDto';


export class CommonDtoMapper {
    static getTelegramAuthDto(loginData: FromTelegramAuthDto) {
        return new TelegramToBalanceAuthDto({
            authDate: loginData.auth_date.toString(),
            firstName: loginData.first_name,
            hash: loginData.hash,
            userId: loginData.id,
            lastName: loginData.last_name,
            photoUrl: loginData.photo_url,
        });
    }

    static getVkAuthDto(loginData: FromVkAuthDto) {
        return new VkToBalanceAuthDto({
            firstName: loginData.first_name,
            hash: loginData.hash,
            uid: loginData.uid,
            lastName: loginData.last_name,
            photoRec: loginData.photo_rec,
            photo: loginData.photo,
        });
    }
}