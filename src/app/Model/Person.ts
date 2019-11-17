export class Person {
    name: string;
    id: number;

    public constructor(
        fields?: {
            name?: string,
            id?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}