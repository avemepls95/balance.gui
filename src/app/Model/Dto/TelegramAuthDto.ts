export class TelegramAuthDto {
    authDate: string;
    firstName: string;
    hash: string;
    lastName: string;
    photoUrl: string;
    userId: string;
    username: string;

    public constructor(
        fields?: {
            authDate?: string,
            firstName?: string,
            hash?: string,
            lastName?: string,
            photoUrl?: string
            userId?: string
            username?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}