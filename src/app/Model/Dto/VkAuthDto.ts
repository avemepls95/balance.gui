export class VkAuthDto {
    firstName: string;
    hash: string;
    lastName: string;
    photo: string;
    photoRec: string;
    uid: string;

    public constructor(
        fields?: {
            firstName?: string,
            hash?: string,
            lastName?: string,
            photo?: string
            photoRec?: string
            uid?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}