import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Payment } from 'src/app/Model/Check';
import { Position } from 'src/app/Model/Position';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PositionCardComponent } from 'src/app/Components/position-card/position-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'rxjs';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
})
export class CheckComponent implements OnInit {

  titleFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  displayedColumns: string[] = ['index', 'title', 'amount', 'actions'];
  positionsDataSource: MatTableDataSource<Position>;
  paymentsDataSource: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.positionsDataSource = new MatTableDataSource(this.positions);

    this.newPayment = new Payment();
    this.payments.push(this.newPayment);
    this.paymentsDataSource = new MatTableDataSource(this.payments);
  }

  positions: Array<Position> = [];

  payments: Array<Payment> = [];
  newPayment: Payment;

  ngOnInit() {
    this.positionsDataSource.paginator = this.paginator;
    this.positionsDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.positionsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.positionsDataSource.paginator) {
      this.positionsDataSource.paginator.firstPage();
    }
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(PositionCardComponent, {
      width: '300px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addPosition(result.data);
      } else if (result.event == 'Edit') {
        this.updatePosition(result.data);
      } else if(result.event == 'Delete'){
        this.deletePosition(result.data);
      }
    });
  }

  addPosition(data: Position) {
    this.positions.push(new Position({
      internalId: this.positions.length + 1,
      title: data.title,
      amount: data.amount
    }));

    this.positionsDataSource.data = this.positions;
    this.openSnackBar("Position was added!");
  }

  updatePosition(data: Position) {
    const index = this.positions.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid position id:" + data);
    }

    this.positions[index] = data;
    this.positionsDataSource.data = this.positions;
  }

  deletePosition(data: Position) {
    const index = this.positions.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid position id:" + data);
    }

    this.positions.splice(index, 1);
    this.positionsDataSource.data = this.positions;
  }

  addPayment(index) {
    // this.newPosition = new Payment ({ title: "", amount: "" });
    // this.positions.push(this.newPosition);
    // this.toastr.success('New row added successfully', 'New Row');
    return true;
  }

  deletePayment(index) {
    // if (this.positions.length == 1) {
    //   this.toastr.error("Can't delete the row when there is only one row", 'Warning');
    //   return false;
    // } else {
    //   this.positions.splice(index, 1);
    //   this.toastr.warning('Row deleted successfully', 'Delete row');
    //   return true;
    // }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "",
      { 
        duration: 1000,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: 'snackbar'
      });
  }
}
