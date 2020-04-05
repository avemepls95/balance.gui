export class Discount {
    apply: boolean = false;
    value: number = 0;

    public constructor(
        fields?: {
            apply?: boolean,
            value?: number
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}