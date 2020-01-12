import { FromTelegramAuthDto } from './Model/Dto/Auth/FromTelegramAuthDto'
import { FromVkAuthDto } from './Model/Dto/Auth/FromVkAuthDto';

export class LocalStorageManager {
    static userFirstNameKey = 'userFirstName';
    static userLastNameKey = 'userLastName';
    static userAuthDateKey = 'userAuthDate';
    static userHashKey = 'userHash';
    static userIdKey = 'userId';
    static userPhotoUrlKey = 'userPhotoUrl';

    static setUserData(data: FromTelegramAuthDto | FromVkAuthDto) {
        if (this.isTelegramData(data)){
            this.setUserDataFromTelegram(data as FromTelegramAuthDto);
            return;
        }

        this.setUserDataFromVk(data as FromVkAuthDto);
    }

    private static setUserDataFromTelegram(data: FromTelegramAuthDto) {
        localStorage.setItem(this.userFirstNameKey, data.first_name);
        localStorage.setItem(this.userLastNameKey, data.last_name);
        localStorage.setItem(this.userAuthDateKey, data.auth_date.toString());
        localStorage.setItem(this.userHashKey, data.hash);
        localStorage.setItem(this.userIdKey, data.id.toString());
        localStorage.setItem(this.userPhotoUrlKey, data.photo_url);
    }

    private static setUserDataFromVk(data: FromVkAuthDto) {
        localStorage.setItem(this.userFirstNameKey, data.first_name);
        localStorage.setItem(this.userLastNameKey, data.last_name);
        localStorage.setItem(this.userHashKey, data.hash);
        localStorage.setItem(this.userIdKey, data.uid.toString());
        localStorage.setItem(this.userPhotoUrlKey, data.photo_rec);
    }

    private static isTelegramData(data) {
        return data.hasOwnProperty('photo_url');
    }
}