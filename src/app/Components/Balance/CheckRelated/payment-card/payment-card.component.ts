import { Component, OnInit, Optional, Inject, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/Model/User';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EMPTY } from 'rxjs';
import { Payment } from 'src/app/Model/Balance/Payment';
import { isNullOrUndefined } from 'util';
import { ICanBeCreated } from 'src/app/Interfaces/ICanBeCreated';
import { SearchUserControlComponent } from 'src/app/Components/Controls/search-user-control/search-user-control.component';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent implements OnInit, AfterContentInit, ICanBeCreated {

  action: string;
  payment: Payment;

  @ViewChild('searchUserControl', { static: false }) searchUserControl: SearchUserControlComponent;

  constructor(
    public dialogRef: MatDialogRef<PaymentCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.payment = data.obj;
    this.action = data.action;
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    if (isNullOrUndefined(this.payment.user)) {
      this.payment.user = {} as User;
    } else if (this.action != 'Delete') {
      setTimeout(() => {
        this.searchUserControl.setValue(this.payment.user.username);
      }, 0);
    }
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.payment });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectedUser(user: User): void {
    this.payment.user = user;
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
