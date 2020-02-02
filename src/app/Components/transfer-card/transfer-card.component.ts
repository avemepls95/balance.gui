import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentCardComponent } from '../CheckRelated/payment-card/payment-card.component';
import { Debt } from 'src/app/Model/Debt';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../Common/confirm-dialog/confirm-dialog.component';
import { isNullOrUndefined } from 'util';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/Model/User';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer-card',
  templateUrl: './transfer-card.component.html',
  styleUrls: ['./transfer-card.component.css']
})
export class TransferCardComponent implements OnInit {

  debt: Debt;
  amount: number = 0;
  user: User;

  isDebtMode: boolean = false;

  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;
  userAlreadyIsSelected: boolean = false;

  currentUserId: number;

  searchResultEmptyMessage: string;

  constructor(
    private balanceApiService: BalanceApiService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PaymentCardComponent>,
    private translateService: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Debt,
  ) {
    this.currentUserId = (Number)(localStorage.getItem(LocalStorageManager.userIdKey));

    this.searchResultEmptyMessage = this.translateService.instant('check.searchResultsEmpty');

    if (!isNullOrUndefined(data)) {
      this.debt = data;
      this.amount = -data.amount;
      this.user = data.user;
      this.isDebtMode = true;
    }
  }

  ngOnInit() {
    this.searchUserCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          if (this.userAlreadyIsSelected) {
            this.userAlreadyIsSelected = false;
            this.isLoading = false;
            return EMPTY;
          }

          return this.balanceApiService.getUsersSuggestion(value)
            .pipe(finalize(() => { this.isLoading = false }));
        })
      )
      .subscribe(data => {
        if (isNullOrUndefined(data['data'])) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          this.filteredUsers = data['data'].filter(u => u.id != this.currentUserId);
          if (this.filteredUsers.length == 0)
            this.errorMsg = this.searchResultEmptyMessage;
        }
      });
  }

  doAction() {
    const message = 'Sure to register transfer to ' + this.user.username +
      ' in the amount of ' + this.amount + '?';

    const dialogData = new ConfirmDialogModel("Confirm Transfer", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      let returnObject = this.isDebtMode ?
        { amount: this.amount } :
        { amount: this.amount, user: this.user }

      this.dialogRef.close(returnObject);
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.user = this.filteredUsers.filter(u => u.id == +event.option.value.id)[0];
    this.userAlreadyIsSelected = true;
  }

  onUserInputTextChange(value) {
    if (value != '')
      return;

    this.user.id = NaN;
  }

  displayFn(user: User) {
    return user ? user.username : user;
  }

  canRegister() {
    let canRegister = this.amount != 0 && !isNaN(this.amount) &&
      this.amount > 0;
    return this.isDebtMode ? 
      canRegister && this.amount <= - this.debt.amount :
      canRegister ;
  }

}
