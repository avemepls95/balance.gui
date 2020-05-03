export class PositionDiscountDto {
    type: string;
    value: number;

    public constructor(
        fields?: {
            type?: string,
            value?: number
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}