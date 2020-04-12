import { DISCOUNT_TYPE } from '../Discount/discount-type.enum';

export class DiscountDto {
    type: DISCOUNT_TYPE;
    value: number;

    public constructor(
        fields?: {
            type?: DISCOUNT_TYPE,
            value?: number
        }) {
        if (fields)
            Object.assign(this, fields);
    }
}