import { DISCOUNT_TYPE } from './discount-type.enum';

export class Discount {
    apply: boolean = false;
    value: number = 0;
    type: DISCOUNT_TYPE = DISCOUNT_TYPE.PERCENT;

    public constructor(
        fields?: {
            apply?: boolean,
            value?: number,
            type?: DISCOUNT_TYPE
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}