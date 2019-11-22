import { Guid } from "guid-typescript";

export class Position {
    id: Guid;
    amount: number;
    title: string;

    public constructor(
        fields?: {
            id?: number,
            amount?: string,
            title?: string
        }) 
    {
        if (fields)
            Object.assign(this, fields);

        if (fields.id == null)
            this.id = Guid.create();
    }
}