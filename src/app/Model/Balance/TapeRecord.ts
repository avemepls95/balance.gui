export class TapeRecord {
    id: number;
    type: string;
    date: Date;
    data: any;

    public constructor(
        fields?: {
            id?: number,
            type?: string,
            date?: Date,
            data?: any;
        }) {
        if (fields) Object.assign(this, fields);
    }
}