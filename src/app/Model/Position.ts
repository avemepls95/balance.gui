export class Position {
    internalId: number;
    id: number;
    amount: number;
    title: string;

    public constructor(
        fields?: {
            internalId?: number;
            id?: number,
            amount?: number,
            title?: string
        }) 
    {
        if (fields)
            Object.assign(this, fields);
    }
}