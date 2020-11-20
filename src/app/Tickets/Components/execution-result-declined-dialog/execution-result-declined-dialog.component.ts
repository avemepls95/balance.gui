import { Component, OnInit, } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Common/Components/confirm-dialog/confirm-dialog.component';
import { MyErrorStateMatcher } from 'src/app/Common/Utils/MyErrorStateMatcher';

@Component({
  selector: 'app-execution-result-declined-dialog',
  templateUrl: './execution-result-declined-dialog.component.html',
  styleUrls: ['./execution-result-declined-dialog.component.css']
})
export class ExecutionResultDeclinedDialogComponent implements OnInit {

  commentFormControl: FormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ExecutionResultDeclinedDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

  doAction(): void {
    if (!this.commentFormControl.value)
      return;

    const dialogData = new ConfirmDialogModel('Подтверждение', 'Отклонить свое участие в задаче?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      this.dialogRef.close(this.commentFormControl.value);
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
