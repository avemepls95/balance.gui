import { Payment } from './Payment';
import { Position } from 'src/app/Model/Position';
import { Discount } from './Discount';
import { MathExtensions } from '../Utils/MathExtensions';

export class Check {
    id: number;
    title: string;
    state: string;
    isReadyForProcess: boolean;
    positions: Position[] = [];
    payments: Payment[] = [];
    createdAt: Date;
    roles: string[];
    discount: Discount = new Discount();

    public constructor(
        fields?: {
            id?: number,
            title?: string,
            state: string,
            isReadyForProcess: boolean,
            positions?: Position[],
            payments?: Payment[],
            createdAt?: Date,
            roles?: string[],
            discount: Discount;
        }) {
        if (fields) Object.assign(this, fields);
    }

    recalculateWithDiscount(oldDiscount): void {
        if (!this.discount.apply)
            throw Error("Discount shouldn't apply!");

        if (this.positions.length == 0)
            return;

        let multiplier = this.discount.value;
        if (oldDiscount != 0){
            multiplier = 100 - MathExtensions.round((100 - this.discount.value) / (100 - oldDiscount) * 100, 2);
        }

        this.positions.forEach(position => {
            if (!position.applyDiscount)
                return;

            position.recalculateAmountWithDiscount(position.amount, multiplier);
            position.recalculateConsumptionsWithDiscount(multiplier);
        });
    }
}