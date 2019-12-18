
export class CreateUpdatePaymentDto {
    amount: number;
    userId: number;

    public constructor(
        fields?: {
            amount?: number,
            userId?: number
        }) {
        if (fields) Object.assign(this, fields);
    }
}