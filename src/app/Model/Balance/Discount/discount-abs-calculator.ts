import { DiscountCalculator } from './discount-calculator';
import { Position } from '../Position';
import { MathExtensions } from 'src/app/Utils/MathExtensions';
import { isNullOrUndefined } from 'util';

export class DiscountAbsCalculator extends DiscountCalculator {

    public setDiscountValue(value: number): void {
        if (value < 0 || value > Number.MAX_SAFE_INTEGER) {
            this._check.discount.value = 0;
            return;
        }

        this._check.discount.value = value;
    }

    public recalculatePosition(position: Position): void {
        this.recalculateConsumptionsWithDiscount(position);
        this.recalculatePositionAmountWithDiscount(position);
    }

    public recalculatePositionAmountWithDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        const indexInPositions = this._check.positions.findIndex(p => p.internalId == position.internalId);
        const isNewPosition = indexInPositions == -1;
        let sum = this._check.positions.filter(p => p.applyDiscount).reduce((sum, current) => sum + current.amountWithoutDiscount, 0) +
            position.amountWithoutDiscount;

        if (!isNewPosition && this._check.positions[indexInPositions].applyDiscount == position.applyDiscount)
            sum -= this._check.positions[indexInPositions].amountWithoutDiscount;

        let multiplier = position.amountWithoutDiscount / sum;
        position.amount = MathExtensions.round(position.amountWithoutDiscount - this._check.discount.value * multiplier, 2);
    }

    public recalculatePositionAmountWithoutDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        const indexInPositions = this._check.positions.findIndex(p => p.internalId == position.internalId);
        const isNewPosition = indexInPositions == -1;
        let sum = this._check.positions.filter(p => p.applyDiscount).reduce((sum, current) => sum + current.amount, 0) + position.amount;

        if (!isNewPosition && this._check.positions[indexInPositions].applyDiscount == position.applyDiscount)
            sum -= this._check.positions[indexInPositions].amount;

        let multiplier = position.amount / sum;
        position.amountWithoutDiscount = MathExtensions.round(position.amount + this._check.discount.value * multiplier, 2);
    }

    public recalculateConsumptionsWithDiscount(position: Position) {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        const indexInPositions = this._check.positions.findIndex(p => p.internalId == position.internalId);
        const isNewPosition = indexInPositions == -1;
        let sum = this._check.positions.filter(p => p.applyDiscount).reduce((sum, current) => sum + current.amountWithoutDiscount, 0) +
            position.consumptions.reduce((sum, current) => sum + current.amountWithoutDiscount, 0);
        if (!isNewPosition && this._check.positions[indexInPositions].applyDiscount == position.applyDiscount)
            sum -= this._check.positions[indexInPositions].amountWithoutDiscount;

        position.consumptions.forEach(consumption => {
            let multiplier = consumption.amountWithoutDiscount / sum;
            consumption.amount = MathExtensions.round(consumption.amountWithoutDiscount - this._check.discount.value * multiplier, 2);
        });
    }

    public recalculateConsumptionsWithoutDiscount(position: Position) {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        const positionDiscount = position.amountWithoutDiscount - position.amount;
        let sum = position.consumptions.reduce((sum, current) => sum + current.amount, 0);

        position.consumptions.forEach(consumption => {
            let multiplier = consumption.amount / sum;
            consumption.amountWithoutDiscount = MathExtensions.round(consumption.amount + positionDiscount * multiplier, 2);
        });
    }


    public rollbackConsumptionsWithDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        position.consumptions.forEach(consumption => {
            consumption.amount = consumption.amountWithoutDiscount;
        });
    }
}