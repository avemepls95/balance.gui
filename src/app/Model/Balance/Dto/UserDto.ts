export class UserDto {
    id: number;
    username: string;

    public constructor(
        fields?: {
            id?: number
            username?: string,
        }) {
        if (fields) Object.assign(this, fields);
    }
}