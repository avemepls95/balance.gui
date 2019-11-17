export class Position {
    amount: number;
    title: string;

    public constructor(
        fields?: {
            amount?: string,
            title?: string
        }) {
        if (fields) Object.assign(this, fields);
    }
}