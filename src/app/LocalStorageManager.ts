import { FromTelegramAuthDto } from './Model/Balance/Dto/Auth/FromTelegramAuthDto'
import { FromVkAuthDto } from './Model/Balance/Dto/Auth/FromVkAuthDto';

export class LocalStorageManager {
    static userFirstNameKey = 'userFirstName';
    static userLastNameKey = 'userLastName';
    static userAuthDateKey = 'userAuthDate';
    static userHashKey = 'userHash';
    static userIdKey = 'userId';
    static userPhotoUrlKey = 'userPhotoUrl';
    static tokenKey = 'token';

    private static authFieldsKeys = [
        LocalStorageManager.userFirstNameKey,
        LocalStorageManager.userLastNameKey,
        LocalStorageManager.userAuthDateKey,
        LocalStorageManager.userHashKey,
        LocalStorageManager.userIdKey,
        LocalStorageManager.userPhotoUrlKey,
    ]

    static setUserData(data: FromTelegramAuthDto | FromVkAuthDto) {
        LocalStorageManager.authFieldsKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
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
        // localStorage.setItem(this.userIdKey, data.id.toString());
        localStorage.setItem(this.userPhotoUrlKey, data.photo_url);
    }

    private static setUserDataFromVk(data: FromVkAuthDto) {
        localStorage.setItem(this.userFirstNameKey, data.first_name);
        localStorage.setItem(this.userLastNameKey, data.last_name);
        localStorage.setItem(this.userHashKey, data.hash);
        // localStorage.setItem(this.userIdKey, data.uid.toString());
        if (data.photo_rec != '/images/camera_50.png?ava=1')
            localStorage.setItem(this.userPhotoUrlKey, data.photo_rec);
    }

    private static isTelegramData(data) {
        return data.hasOwnProperty('photo_url');
    }

    static setUserId(id: number) {
        localStorage.setItem(LocalStorageManager.userIdKey, id.toString())
    }
}