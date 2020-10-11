import { DiscountCalculator } from './discount-calculator';
import { Position } from '../Position';
import { MathExtensions } from 'src/app/Utils/MathExtensions';
import { isNullOrUndefined } from 'util';

export class DiscountPercentCalculator extends DiscountCalculator {

    public setDiscountValue(value: number): void {
        this._check.discount.value = value < 0 ?
            0 :
            (value > 99 ? 99 : value);
    }

    public recalculatePosition(position: Position): void {
        this.recalculatePositionAmountWithDiscount(position);
        this.recalculateConsumptionsWithDiscount(position);
    }

    public recalculatePositionAmountWithDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        let multiplier = this.getDiscountMultiplier();

        position.amount = MathExtensions.round(position.amountWithoutDiscount * multiplier, 2);
    }

    public recalculatePositionAmountWithoutDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        let multiplier = this.getDiscountMultiplier();

        position.amountWithoutDiscount = MathExtensions.round(+position.amount / multiplier, 2);
    }

    public recalculateConsumptionsWithDiscount(position: Position) {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        let multiplier = this.getDiscountMultiplier();

        position.consumptions.forEach(consumption => {
            consumption.amount = MathExtensions.round(consumption.amountWithoutDiscount * multiplier, 2);
        });
    }

    public recalculateConsumptionsWithoutDiscount(position: Position) {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        let multiplier = this.getDiscountMultiplier();

        position.consumptions.forEach(consumption => {
            consumption.amountWithoutDiscount = MathExtensions.round(+consumption.amount / multiplier, 2);
        });
    }

    public rollbackConsumptionsWithDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        let multiplier = this.getDiscountMultiplier();

        position.consumptions.forEach(consumption => {
            consumption.amount = MathExtensions.round(+consumption.amount / multiplier, 2);
        });
    }

    private getDiscountMultiplier(): number {
        return 1 - this._check.discount.value / 100;
    }
}