import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentCardComponent } from '../CheckRelated/payment-card/payment-card.component';
import { User } from 'src/app/Model/User';
import { Debt } from 'src/app/Model/Debt';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../Common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transfer-card',
  templateUrl: './transfer-card.component.html',
  styleUrls: ['./transfer-card.component.css']
})
export class TransferCardComponent implements OnInit {

  debt: Debt;
  amount: number = 0;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PaymentCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data : Debt
  ) {
    this.debt = data;
    this.amount = -data.amount;
  }

  ngOnInit() {
  }

  doAction() {
    const message = 'Sure to register transfer to ' + this.debt.user.username +
     ' in the amount of ' + this.amount + '?';

    const dialogData = new ConfirmDialogModel("Confirm Transfer", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

        this.dialogRef.close({ amount: this.amount});
    });
  }

  closeDialog() {
    this.dialogRef.close({ amount: NaN });
  }

  canRegister() {
    return this.amount != 0 && !isNaN(this.amount);
  }

}
