export class DiscountDto {
    apply: boolean;
    value: number;

    public constructor(
        fields?: {
            apply?: boolean,
            value?: number
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}