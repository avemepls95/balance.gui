import { MathExtensions } from 'src/app/Common/Utils/MathExtensions';
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

        this.alignConsumptions();
    }

    public recalculateCheckWithoutDiscount(): void {
        this._check.positions.forEach(position => {
            if (!position.applyDiscount)
                return;

            this.recalculatePositionAmountWithoutDiscount(position);
            this.recalculateConsumptionsWithoutDiscount(position);
        });

        this.alignConsumptions();
    }

    private alignConsumptions() {
      for (const position of this._check.positions) {
        if (!position.consumptions || position.consumptions.length == 0 || !position.isEqualConsumptions)
          return;

        if (!position.amount)
          position.amount = 0;

        const eachConsumptionRealPart = MathExtensions.floor(position.amount / position.consumptions.length, 2);
        const eachConsumptionPartWithoutDiscount = MathExtensions.floor(position.amountWithoutDiscount / position.consumptions.length, 2);
        position.consumptions.forEach(consumption => {
          consumption.amount = eachConsumptionRealPart;
          consumption.amountWithoutDiscount = eachConsumptionPartWithoutDiscount;
        });

        if (eachConsumptionRealPart * position.consumptions.length == position.amount) {
            return;
        }

        let index = 0;
        let currentSum = MathExtensions.round(position.consumptions.reduce((sum, current) => sum + current.amount, 0), 2);
        while (currentSum != position.amount) {
          position.consumptions[index].amount = MathExtensions.round(
            position.consumptions[index].amount + 0.01, 2
          );

          if (index == position.consumptions.length - 1)
              index = 0;

          currentSum = MathExtensions.round(position.consumptions.reduce((sum, current) => sum + current.amount, 0), 2);
          ++index;
        }
      }
    }

    public abstract recalculatePosition(position: Position): void;

    public abstract recalculatePositionAmountWithDiscount(position: Position): void;

    public abstract recalculatePositionAmountWithoutDiscount(position: Position): void;

    public abstract recalculateConsumptionsWithDiscount(position: Position): void;

    public abstract recalculateConsumptionsWithoutDiscount(position: Position): void;

    public abstract rollbackConsumptionsWithDiscount(position: Position): void;

}
