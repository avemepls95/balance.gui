import { MathExtensions } from 'src/app/Common/Utils/MathExtensions';
import { Consumption } from './Consumption';

export class Position {
    internalId: number;
    id: number;
    amount: number;
    title: string;
    consumptions: Consumption[];
    applyDiscount: boolean;

    amountWithoutDiscount: number;

    public constructor(
        fields?: {
            internalId?: number;
            id?: number,
            amount?: number,
            title?: string,
            consumptions?: Consumption[],
            applyDiscount?: boolean,
            amountWithoutDiscount?: number
        }) {
        if (fields)
            Object.assign(this, fields);
    }

    public recalculateEqualConsumptions(): void {
        if (!this.consumptions || this.consumptions.length == 0 || !this.isEqualConsumptions)
            return;

        if (!this.amount)
            this.amount = 0;

        const eachConsumptionRealPart = MathExtensions.floor(this.amount / this.consumptions.length, 2);
        const eachConsumptionPartWithoutDiscount = MathExtensions.floor(this.amountWithoutDiscount / this.consumptions.length, 2);
        this.consumptions.forEach(consumption => {
          consumption.amount = eachConsumptionRealPart;
          consumption.amountWithoutDiscount = eachConsumptionPartWithoutDiscount;
        });

        if (eachConsumptionRealPart * this.consumptions.length == this.amount) {
            return;
        }

        let index = 0;
        let currentSum = MathExtensions.round(this.consumptions.reduce((sum, current) => sum + current.amount, 0), 2);
        while (currentSum != this.amount) {
            this.consumptions[index].amount = MathExtensions.round(
                this.consumptions[index].amount + 0.01, 2
            );

            if (index == this.consumptions.length - 1)
                index = 0;

            currentSum = MathExtensions.round(this.consumptions.reduce((sum, current) => sum + current.amount, 0), 2);
            ++index;
        }
    }

    isEqualConsumptions(): boolean {
        const tolerance = 0.2;
        const amounts = this.consumptions.map(c => c.amount);

        return amounts.every(a => Math.abs(a - amounts[0]) <= tolerance);
    }
}
