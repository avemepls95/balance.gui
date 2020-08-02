import { Component, OnInit, Optional, Inject, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionCardComponent } from '../position-card/position-card.component';
import { Consumption } from 'src/app/Model/Balance/Consumption';
import { User } from 'src/app/Model/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined, isNull } from 'util';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { DiscountCalculator } from 'src/app/Model/Balance/Discount/discount-calculator';
import { Position } from 'src/app/Model/Balance/Position';
import { DISCOUNT_TYPE } from 'src/app/Model/Balance/Discount/discount-type.enum';

@Component({
  selector: 'app-consumptions',
  templateUrl: './consumptions-card.component.html',
  styleUrls: ['./consumptions-card.component.css']
})
export class ConsumptionsCardComponent implements AfterContentInit {

  action: string;
  position: Position;
  consumptions: Consumption[] = [];
  discountInfo: any;
  discountCalculator: DiscountCalculator;

  filteredUsers: User[];
  isLoading = false;

  userAlreadyIsSelected: boolean = false;

  myForm: FormGroup;

  searchResultEmptyMessage: string;

  userControlCounter: number = 0;

  errorMessageVisibilityArray: Array<boolean> = []

  constructor(
    public dialogRef: MatDialogRef<PositionCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private balanceApiService: BalanceApiService,
    private translateHelper: TranslateHelper
  ) {
    this.position = data.position
    this.consumptions = data.position.consumptions ? data.position.consumptions : [];
    this.userControlCounter = this.consumptions ? this.consumptions.length : 0;
    this.action = data.action;
    this.discountInfo = data.discountInfo;
    this.searchResultEmptyMessage = this.translateHelper.getValue('check.searchResultsEmpty');
    this.discountCalculator = data.discountCalculator;

    this.myForm = new FormGroup({});
    for (let i = 0; i < this.consumptions.length; ++i) {
      this.addUserControl(i);
    }

    this.fillAmountsWithoutDiscount()
  }

  ngAfterContentInit(): void {
    if (isNullOrUndefined(this.consumptions)) {
      // this.payment.user = {} as User;
      return;
    }

    setTimeout(() => {
      for (let i = 0; i < this.consumptions.length; ++i) {
        let elem = <HTMLInputElement>document.getElementById("user-input-" + i.toString());
        elem.value = this.consumptions[i].user.username;
      }
    }, 0);
  }

  fillAmountsWithoutDiscount(): void {
    if (!this.discountInfo.apply) {
      this.consumptions.forEach(consumption => {
        consumption.amountWithoutDiscount = consumption.amount;
      });

      return;
    }

    this.discountCalculator.recalculateConsumptionsWithoutDiscount(this.position);
  }

  addUserControl(number: number): void {
    let userControl = new FormControl();
    this.registerUserControlValueChanged(userControl, number);
    this.myForm.addControl('userControl' + number.toString(), userControl);
  }

  registerUserControlValueChanged(userControl, index: number): void {
    userControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.setUserSearchMessage(index, '');
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap((value: string) => {
          if (this.userAlreadyIsSelected) {
            this.userAlreadyIsSelected = false;
            this.isLoading = false;
            return EMPTY;
          }

          if (value == '')
            this.consumptions[index].user = undefined;

          return this.balanceApiService.getUsersSuggestion(value)
            .pipe(finalize(() => { this.isLoading = false }));
        })
      )
      .subscribe(data => {
        if (isNullOrUndefined(data['data'])) {
          this.consumptions[index].user = undefined;
          this.setUserSearchMessage(index, "Internal Error. We're Sorry :(");
          this.filteredUsers = [];
        } else {
          if (data['data'].length == 0) {
            this.consumptions[index].user = undefined;
            this.setUserSearchMessage(index, this.searchResultEmptyMessage);
          }
          this.filteredUsers = data['data'];
        }
      });
  }

  displayFn(user: User): User | string {
    return user ? user.username : user;
  }

  selectedUser(event: MatAutocompleteSelectedEvent, consumption: Consumption): void {
    consumption.user = this.filteredUsers.filter(u => u.id == +event.option.value.id)[0];
    this.userAlreadyIsSelected = true;
  }

  addEmptyConsumption(): void {
    this.consumptions.push(new Consumption());

    this.addUserControl(this.userControlCounter);
    ++this.userControlCounter;
  }

  deleteConsumption(consumptionIndex): void {
    this.consumptions.splice(consumptionIndex, 1);
  }

  setUserSearchMessage(index: number, message: string): void {
    let invisible = message == '' || isNullOrUndefined(message);
    this.errorMessageVisibilityArray[index] = !invisible;

    let elem = <HTMLInputElement>document.getElementById("error-message-" + index.toString());
    elem.textContent = message;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.consumptions });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  canBeCreated(): boolean {
    if (this.consumptions.length == 0)
      return false;

    for (var consumption of this.consumptions) {
      if (!consumption.amount || consumption.amount == 0 || !consumption.user)
        return false;
    }

    return true;
  }

  canAdd(): boolean {
    if (this.consumptions.length == 0)
      return true;

    for (var consumption of this.consumptions) {
      if (!consumption.amount || consumption.amount == 0 || !consumption.user)
        return false;
    }

    return true;
  }

  onAmountWithoutDiscountChanged(consumption: Consumption): void {
    if (!this.discountInfo.apply) {
      consumption.amount = consumption.amountWithoutDiscount;
      return;
    }

    const discountType = this.discountCalculator.getDiscountType();
    if (discountType == DISCOUNT_TYPE.PERCENT) {
      const multiplier = 1 - this.discountInfo.value / 100;
      consumption.amount = consumption.amountWithoutDiscount * multiplier;

      return;
    }

    this.discountCalculator.recalculateConsumptionsWithDiscount(this.position);
  }
}
