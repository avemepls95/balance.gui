import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Payment } from 'src/app/Model/Payment';
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
import { User } from 'src/app/Model/User';
import { PaymentCardComponent } from '../payment-card/payment-card.component';

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

  positionsDisplayedColumns: string[] = [ 'index', 'title', 'amount', 'actions' ];
  positionsDataSource: MatTableDataSource<Position>;

  paymentsDisplayedColumns: string[] = [ 'index', 'username', 'amount', 'actions' ];
  paymentsDataSource: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.positionsDataSource = new MatTableDataSource(this.positions);

    let newPayment = new Payment({amount: 12, user: new User({id: 1, username: "Artem"})});
    this.payments.push(newPayment);
    this.paymentsDataSource = new MatTableDataSource(this.payments);
  }

  positions: Array<Position> = [];

  payments: Array<Payment> = [];

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

  openPositionCard(action, obj) {
    let data = {
      obj: obj,
      action: action
    }
    const dialogRef = this.dialog.open(PositionCardComponent, {
      width: '370px',
      data: data
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
      amount: data.amount,
      users: data.users
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

  openPaymentCard(action, obj) {
    let data = {
      obj: Object.assign({}, obj),
      action: action
    }
    const dialogRef = this.dialog.open(PaymentCardComponent, {
      width: '370px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addPayment(result.data);
      } else if (result.event == 'Edit') {
        this.updatePayment(result.data);
      } else if(result.event == 'Delete'){
        this.deletePayment(result.data);
      }
    });
  }

  addPayment(data: Payment) {
    this.payments.push(new Payment({
      internalId: this.positions.length + 1,
      amount: data.amount,
      user: data.user
    }));
    
    this.paymentsDataSource.data = this.payments;
    this.openSnackBar("Payment was added!");
  }

  updatePayment(data: Payment) {
    const index = this.payments.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid payment id:" + data);
    }

    this.payments[index] = data;
    this.paymentsDataSource.data = this.payments;
  }

  deletePayment(data: Payment) {
    const index = this.payments.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid payment id:" + data);
    }

    this.payments.splice(index, 1);
    this.paymentsDataSource.data = this.payments;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "",
      { 
        duration: 800,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: 'snackbar'
      });
  }
}
