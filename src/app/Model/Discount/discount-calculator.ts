import { Check } from '../Check';
import { Position } from '../Position';
import { DISCOUNT_TYPE } from './discount-type.enum';

export abstract class DiscountCalculator {
    protected _check: Check;

    public setCheck(check: Check): void {
        this._check = check;
    }

    public getDiscountType(): DISCOUNT_TYPE {
        return this._check.discount.type;
    }

    public abstract setDiscountValue(value: number): void;

    public recalculateCheckWithDiscount(): void {
        if (!this._check.discount.apply && this._check.discount.value != 0)
            throw Error("Discount shouldn't apply!");

        if (this._check.positions.length == 0)
            return;

        this._check.positions.forEach(position => {
            if (!position.applyDiscount)
                return;

            this.recalculatePosition(position);
        });
    }

    public recalculateCheckWithoutDiscount(): void {
        this._check.positions.forEach(position => {
            if (!position.applyDiscount)
                return;
                
            this.recalculatePositionAmountWithoutDiscount(position);
            this.recalculateConsumptionsWithoutDiscount(position);
        });
    }

    public abstract recalculatePosition(position: Position): void;

    public abstract recalculatePositionAmountWithDiscount(position: Position): void;

    public abstract recalculatePositionAmountWithoutDiscount(position: Position): void;

    public abstract recalculateConsumptionsWithDiscount(position: Position): void;

    public abstract recalculateConsumptionsWithoutDiscount(position: Position): void;
    
    public abstract rollbackConsumptionsWithDiscount(position: Position): void;

}