import { DiscountCalculator } from './discount-calculator';
import { Position } from '../Position';
import { MathExtensions } from 'src/app/Utils/MathExtensions';
import { isNullOrUndefined } from 'util';

export class DiscountAbsCalculator extends DiscountCalculator {

    public setDiscountValue(value: number): void {
        if (value < 1 || value > Number.MAX_SAFE_INTEGER) {
            this._check.discount.value = 1;
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

        let sum = this._check.positions.reduce((sum, current) => sum + current.amountWithoutDiscount, 0);

        const indexInPositions = this._check.positions.findIndex(p => p.internalId == position.internalId);
        const isNewPosition = indexInPositions == -1;
        if (isNewPosition)
            sum += position.amountWithoutDiscount;
        
        let multiplier = position.amountWithoutDiscount / sum;
        let tmpAmount = position.amountWithoutDiscount - MathExtensions.round(this._check.discount.value * multiplier, 2);

        if (isNewPosition) {
            position.amount = tmpAmount;
            return;
        }

        position.amount = tmpAmount 
            - this._check.positions[indexInPositions].amountWithoutDiscount 
            + position.amountWithoutDiscount;
    }

    public recalculateConsumptionsWithDiscount(position: Position) {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        let sum = 0;
        this._check.positions.filter(p => p.applyDiscount).forEach(position => {
            sum += position.consumptions.reduce((sum, current) => sum + current.amountWithoutDiscount, 0);
        });

        position.consumptions.forEach(consumption => {
            let multiplier = consumption.amountWithoutDiscount / sum;
            consumption.amount = consumption.amountWithoutDiscount - MathExtensions.round(this._check.discount.value * multiplier, 2);
        });
    }

    public rollbackConsumptionsWithDiscount(position: Position): void {
        if (isNullOrUndefined(position))
            throw Error('Position is null or undefined.')

        if (!position.consumptions || position.consumptions.length == 0)
            return;

        let sum = 0;
        this._check.positions.filter(p => p.applyDiscount).forEach(position => {
            sum += position.consumptions.reduce((sum, current) => sum + current.amountWithoutDiscount, 0);
        });

        position.consumptions.forEach(consumption => {
            let multiplier = consumption.amountWithoutDiscount / sum;
            consumption.amount = consumption.amountWithoutDiscount + MathExtensions.round(this._check.discount.value * multiplier, 2);
        });
    }
}