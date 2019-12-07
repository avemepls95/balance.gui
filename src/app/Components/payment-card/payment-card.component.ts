import { Component, OnInit, Optional, Inject, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, isEmpty } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { User } from 'src/app/Model/User';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EMPTY } from 'rxjs';
import { Payment } from 'src/app/Model/Payment';
import { isNullOrUndefined } from 'util';
import { ICanBeCreated } from 'src/app/Interfaces/ICanBeCreated';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent implements OnInit, AfterContentInit, ICanBeCreated {

  action: string;
  payment: Payment;

  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;

  userAlreadyIsSelected: boolean = false;

  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<PaymentCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private balanceApiService: BalanceApiService) {
    this.payment = data.obj;
    this.action = data.action;
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
        if (data['data'] == undefined) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          if (data['data'].length == 0)
            this.errorMsg = "Search results are empty.";
          this.filteredUsers = data['data'];
        }
      });
  }

  ngAfterContentInit(): void {
    if (isNullOrUndefined(this.payment.user)) {
      this.payment.user = {} as User;
    } else if (this.action != 'Delete') {
      setTimeout(() => {
        this.userInput.nativeElement.value = this.payment.user.username;
      }, 0);
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.payment });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.payment.user = this.filteredUsers.filter(u => u.id == +event.option.value.id)[0];
    this.userAlreadyIsSelected = true;
  }

  removeSelectedUserFromSuggestion(suggestion: User[]): User[] {
    if (this.payment.user == null)
      return suggestion;

    const index = suggestion.findIndex(u => u.id == this.payment.user.id);
    if (index >= 0) {
      suggestion.splice(index, 1);
    }

    return suggestion;
  }

  onUserInputTextChange(value) {
    if (value != '')
      return;

    this.payment.user.id = NaN;
  }

  displayFn(user: User) {
    return user ? user.username : user;
  }

  canBeCreated() : boolean {
    return this.payment.amount != null &&
      this.payment.amount != 0 &&
      this.userIsEmpty(this.payment.user);
  }

  userIsEmpty(user: User) {
    return user != null &&
      !isNaN(user.id);
  }
}
