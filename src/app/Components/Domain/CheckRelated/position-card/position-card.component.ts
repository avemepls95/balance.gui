import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { User } from 'src/app/Model/User';
import { Position } from 'src/app/Model/Position';
import { ICanBeCreated } from 'src/app/Interfaces/ICanBeCreated';
import { ConsumptionsCardComponent } from '../consumptions/consumptions-card.component';
import { Consumption } from 'src/app/Model/Consumption';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Components/Common/confirm-dialog/confirm-dialog.component';
import { Discount } from 'src/app/Model/Discount/discount';
import { isUndefined } from 'util';
import { MathExtensions } from 'src/app/Utils/MathExtensions';
import { DiscountCalculator } from 'src/app/Model/Discount/discount-calculator';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.css']
})
export class PositionCardComponent implements OnInit, ICanBeCreated {

  action: string;
  inputPosition: Position;
  position: Position;
  checkDiscount: Discount;
  discountCalculator: DiscountCalculator;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  equalConsumptions: Boolean = true;

  searchResultEmptyMessage: string;

  @ViewChild('usersInput', { static: false }) usersInput: ElementRef<HTMLInputElement>;

  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<PositionCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private balanceApiService: BalanceApiService,
    private translateHelper: TranslateHelper
  ) {
    data.position = new Position(data.position);

    this.inputPosition = data.position;
    this.position = data.position;
    if (data.action == 'Add')
      this.position.internalId = data.newInternalId;
      
    this.action = data.action;
    this.checkDiscount = data.discount;
    this.position.applyDiscount = data.position.applyDiscount && data.discount.apply;
    this.discountCalculator = data.discountCalculator;

    if (data.action == 'Add' && !!data.predefinedUsers && data.predefinedUsers.length != 0) {
      this.applyPredefinedUsers(data.predefinedUsers);
    }

    this.position.applyDiscount = data.action == 'Add' ?
      data.discount.apply : data.position.applyDiscount;

    this.searchResultEmptyMessage = this.translateHelper.getValue('check.searchResultsEmpty');
  }

  ngOnInit(): void {
    this.equalConsumptions = this.action == 'Add' ? true: this.position.isEqualConsumptions();

    this.fillAmounts()

    this.searchUserCtrl.valueChanges
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.balanceApiService.getUsersSuggestion(value)
          .pipe(finalize(() => { this.isLoading = false }),
          )
        )
      )
      .subscribe(data => {
        if (data['data'] == undefined) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          if (data['data'].length == 0)
            this.errorMsg = this.searchResultEmptyMessage;
          this.filteredUsers = this.removeSelectedUsersFromSuggestion(data['data']);
        }
      });
  }

  fillAmounts() {
    if (isUndefined(this.position.amount))
      this.position.amount = 0;

    if (!this.position.applyDiscount) {
      this.position.amountWithoutDiscount = this.position.amount;
      return;
    }

    const multiplier = 1 - this.checkDiscount.value / 100;

    this.position.amountWithoutDiscount = MathExtensions.round(this.position.amount / multiplier, 2);
  }

  applyPredefinedUsers(users: User[]): void {
    if (this.position.consumptions == null)
      this.position.consumptions = new Array<Consumption>();

    users.forEach(user => {
      this.position.consumptions.push(new Consumption({ user: user, amount: 0 }));
    });
  }

  doAction() {
    if (this.equalConsumptions) {
      this.position.recalculateEqualConsumptions();
    }

    this.dialogRef.close({ event: this.action, data: this.position });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  removeConsumption(consumption: Consumption): void {
    if (this.action == 'View')
      return;

    const index = this.position.consumptions.findIndex(u => u.user.id == consumption.user.id);

    if (index >= 0) {
      this.position.consumptions.splice(index, 1);
      this.position.recalculateEqualConsumptions();
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let user = this.filteredUsers.filter(u => u.id == +event.option.value)[0];
    if (this.position.consumptions == null)
      this.position.consumptions = new Array<Consumption>();

    this.position.consumptions.push(new Consumption({ user: user, amount: 0 }));
    this.position.recalculateEqualConsumptions();

    this.usersInput.nativeElement.value = '';
    this.searchUserCtrl.setValue('');
  }

  onAmountWithoutDiscountChanged(): void {
    if (this.position.applyDiscount)
      this.discountCalculator.recalculatePositionAmountWithDiscount(this.position);
    else
      this.position.amount = this.position.amountWithoutDiscount;

    this.position.recalculateEqualConsumptions();
  }

  removeSelectedUsersFromSuggestion(suggestion: User[]): User[] {
    if (this.position.consumptions == null || this.position.consumptions.length == 0)
      return suggestion;

    this.position.consumptions.map(c => c.user).forEach(selectedUser => {
      const index = suggestion.findIndex(u => u.id == selectedUser.id);
      if (index >= 0) {
        suggestion.splice(index, 1);
      }
    });

    return suggestion;
  }

  equalConsumptionsValueChanged(event) {
    if (!event.checked) {
      this.openConsumptionCard(this.action)
      return;
    }

    if (this.position.consumptions.length == 0 || this.position.consumptions.length == 1)
      return;

    const dialogData = new ConfirmDialogModel(
      this.translateHelper.getValue('common.confirmation'),
      this.translateHelper.getValue('check.makeConsumptionsEqual'));
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult) {
        this.equalConsumptions = false;
        return;
      }

      this.position.recalculateEqualConsumptions();
    });
  }

  openConsumptions(): void {
    this.openConsumptionCard(this.action);
  }

  openConsumptionCard(action: string) {
    let data = {
      obj: this.position.consumptions ? this.position.consumptions.map(c => Object.assign({}, c)) : [],
      action: action,
      discountInfo: {
        apply: this.position.applyDiscount,
        value: this.checkDiscount.value
      } 
    }

    let autofocus = this.position.consumptions && this.position.consumptions.length == 0;
    const dialogRef = this.dialog.open(ConsumptionsCardComponent, {
      maxHeight: '100vh',
      width: '370px',
      data: data,
      autoFocus: autofocus
    });

    dialogRef.afterClosed().subscribe(result => {
      let consumptions = this.position.consumptions;
      if (result.event == 'Cancel') {
        if (!consumptions || consumptions.length == 0 || consumptions.length == 1 ||
          this.position.isEqualConsumptions())
          this.equalConsumptions = true;
        return;
      }

      this.position.consumptions = result.data;
      this.position.amountWithoutDiscount = MathExtensions.round(
        this.position.consumptions.reduce((sum, current) => sum + +current.amountWithoutDiscount, 0),
        2);
      if (this.position.applyDiscount)
        this.discountCalculator.recalculatePositionAmountWithDiscount(this.position);
      else
        this.position.amount = this.position.amountWithoutDiscount;

      if (result.data.length == 1) {
        this.equalConsumptions = true;
        return;
      }
    });
  }

  applyDiscountValueChanged(event) {
    if (event.checked) {
      this.discountCalculator.recalculatePosition(this.position);
  } else {
      this.position.amount = this.position.amountWithoutDiscount;
      this.discountCalculator.rollbackConsumptionsWithDiscount(this.position);
    }

    if (this.equalConsumptions){
      this.position.recalculateEqualConsumptions();
    }
  }

  canBeCreated(): boolean {
    return this.position.title != null &&
      this.position.title != '' &&
      !isNaN(this.position.amount) &&
      this.position.consumptions != null &&
      this.position.consumptions.length != 0;
  }
}
