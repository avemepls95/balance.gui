export class VkToBalanceAuthDto {
    firstName: string;
    hash: string;
    lastName: string;
    photo: string;
    photoRec: string;
    uid: number;

    public constructor(
        fields?: {
            firstName?: string,
            hash?: string,
            lastName?: string,
            photo?: string
            photoRec?: string
            uid?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}