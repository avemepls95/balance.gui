import { Component, Optional, Inject, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Payment } from 'src/app/Balance/Model/Payment';
import { SearchUserControlComponent } from 'src/app/Common/Components/Controls/search-user-control/search-user-control.component';
import { ICanBeCreated } from 'src/app/Common/Components/Interfaces/ICanBeCreated';
import { User } from 'src/app/Common/Model/User';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.css']
})
export class PaymentCardComponent implements AfterContentInit, ICanBeCreated {

  action: string;
  payment: Payment;

  @ViewChild('searchUserControl', { static: false }) searchUserControl: SearchUserControlComponent;
  @ViewChild('searchUserInput', { static: false }) searchUserInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PaymentCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.payment = data.obj;
    this.action = data.action;

    var positionsSum = data.positionsSum;
    if (!!positionsSum)
      this.payment.amount = positionsSum;
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
