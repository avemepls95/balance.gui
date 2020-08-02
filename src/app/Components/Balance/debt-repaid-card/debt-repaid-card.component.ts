import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Debt } from 'src/app/Model/Debt';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../Common/confirm-dialog/confirm-dialog.component';
import { isNullOrUndefined } from 'util';
import { String } from 'typescript-string-operations';

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
    private translateHelper: TranslateHelper,
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
      this.translateHelper.getValue('transfer.commitDebtRepaidConfirmation'),
      this.debt.user.username,
      this.amount);
    const dialogData = new ConfirmDialogModel(
      this.translateHelper.getValue('common.confirmation'),
      message);

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
