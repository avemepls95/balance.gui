export class User {
    username: string;
    id: number;

    public constructor(
        fields?: {
            username?: string,
            id?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}