import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { User } from 'src/app/Common/Model/User';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { String } from 'typescript-string-operations';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Common/Components/confirm-dialog/confirm-dialog.component';
import { Debt } from '../../Model/Debt';

@Component({
  selector: 'app-transfer-card',
  templateUrl: './transfer-card.component.html',
  styleUrls: ['./transfer-card.component.css']
})
export class TransferCardComponent implements OnInit {

  debt: Debt;
  amount: number;
  user: User;
  description: string;

  isDebtMode: boolean = false;
  currentUserId: number;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransferCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Debt,
  ) {
    this.currentUserId = (Number)(localStorage.getItem(LocalStorageManager.userIdKey));

    if (!isNullOrUndefined(data)) {
      this.debt = data;
      this.amount = -data.amount;
      this.user = data.user;
      this.isDebtMode = true;
    }
  }

  ngOnInit() {
  }

  doAction() {
    const message = String.Format(
        'Зафиксировать перевод пользователю {0} в количестве {1}?',
        this.user.username,
        this.amount
    );
    const dialogData = new ConfirmDialogModel('Подтверждение', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      let returnObject = this.isDebtMode ?
        { amount: this.amount } :
        { amount: this.amount, user: this.user, description: this.description }

      this.dialogRef.close(returnObject);
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  selectedUser(user: User): void {
    this.user = user;
  }

  canRegister() {
    let canRegister = this.amount > 0 && !isNaN(this.amount);

    return this.isDebtMode ?
      canRegister && this.amount <= -this.debt.amount :
      canRegister;
  }
}
