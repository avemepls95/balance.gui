import { TelegramAuthDto } from "../Dto/TelegramAuthDto";
import { VkAuthDto } from '../Dto/VkAuthDto';

export class CommonDtoMapper {
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
}