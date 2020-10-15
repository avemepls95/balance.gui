import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { String } from 'typescript-string-operations';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Common/Components/confirm-dialog/confirm-dialog.component';
import { Debt } from '../../Model/Debt';

@Component({
  selector: 'app-transfer-made-card',
  templateUrl: './debt-repaid-card.component.html',
  styleUrls: ['./debt-repaid-card.component.css']
})
export class DebtRepaidCardComponent implements OnInit {

  debt: Debt;
  amount: number;
  description: string;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DebtRepaidCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Debt,
  ) { 
    if (!isNullOrUndefined(data)) {
      this.debt = data;
      this.amount = data.amount;
    }
  }

  ngOnInit() {
  }

  doAction() {
    const message = String.Format(
      'Зафиксировать погашение долга пользователя {0} в количестве {1}?',
      this.debt.user.username,
      this.amount);
    const dialogData = new ConfirmDialogModel('Подтверждение', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      let returnObject = {
        amount: this.amount,
        description: this.description
      }

      this.dialogRef.close(returnObject);
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  canRegister() {
    let canRegister = this.amount > 0 && !isNaN(this.amount);

    return canRegister && this.amount <= this.debt.amount;
  }
}
