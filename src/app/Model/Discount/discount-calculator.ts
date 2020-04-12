import { Check } from '../Check';
import { Position } from '../Position';

export abstract class DiscountCalculator {
    _check: Check;

    public setCheck(check: Check): void {
        this._check = check;
    }

    public abstract setDiscountValue(value: number): void;

    public recalculateCheckWithDiscount(): void {
        if (!this._check.discount.apply)
            throw Error("Discount shouldn't apply!");

        if (this._check.positions.length == 0)
            return;

        this._check.positions.forEach(position => {
            if (!position.applyDiscount)
                return;

            this.recalculatePosition(position);
        });
    }

    public abstract recalculatePosition(position: Position): void;

    public abstract recalculatePositionAmountWithDiscount(position: Position): void;

    public abstract recalculateConsumptionsWithDiscount(position: Position): void;

    public abstract rollbackConsumptionsWithDiscount(position: Position): void;
}