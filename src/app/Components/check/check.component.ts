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
import { config, pipe } from 'rxjs';
import { User } from 'src/app/Model/User';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { Check } from 'src/app/Model/Check';
import { ICanBeCreated } from 'src/app/Interfaces/ICanBeCreated';
import { isNullOrUndefined, isNumber } from 'util';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TouchSequence } from 'selenium-webdriver';
import { ParamsMapper } from 'src/app/Model/Utils/ParamsMapper';
import { LoaderService } from 'src/app/Services/loader.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
})
export class CheckComponent implements OnInit, ICanBeCreated {
  titleFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  positionsDisplayedColumns: string[] = ['index', 'title', 'amount', 'actions'];
  positionsDataSource: MatTableDataSource<Position>;

  paymentsDisplayedColumns: string[] = ['index', 'username', 'amount', 'actions'];
  paymentsDataSource: MatTableDataSource<Payment>;

  check: Check;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private balanceApiService: BalanceApiService,
    activateRoute: ActivatedRoute,
    loaderService: LoaderService) {

    this.check = new Check();
    this.positionsDataSource = new MatTableDataSource(this.check.positions);
    this.paymentsDataSource = new MatTableDataSource(this.check.payments);

    loaderService.show();
    activateRoute.params.subscribe(params => {
      if (!isNullOrUndefined(params['id'])) {
        if (+params['id']) {
          balanceApiService.getCheckById(params['id']).subscribe(result => {
            this.check = ParamsMapper.convertCheckDtoToCheck(result.data[0]);
            this.positionsDataSource = new MatTableDataSource(this.check.positions);
            this.paymentsDataSource = new MatTableDataSource(this.check.payments);
            loaderService.hide();
          });
        } else {
          // TODO: handle incorrect id
        }
      }
    });
  }

  async asdas() { }

  ngOnInit() {
    this.positionsDataSource.paginator = this.paginator;
    this.positionsDataSource.sort = this.sort;
  }

  applyPositionsFilter(filterValue: string) {
    this.applyFilter(this.positionsDataSource, filterValue);
  }

  applyPaymentsFilter(filterValue: string) {
    this.applyFilter(this.paymentsDataSource, filterValue);
  }

  applyFilter(dataSource, filterValue: string) {
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
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
      } else if (result.event == 'Delete') {
        this.deletePosition(result.data);
      }
    });
  }

  addPosition(data: Position) {
    this.check.positions.push(new Position({
      internalId: this.check.positions.length + 1,
      title: data.title,
      amount: data.amount,
      users: data.users
    }));

    this.positionsDataSource.data = this.check.positions;
    this.openSnackBar("Position was added!");
  }

  updatePosition(data: Position) {
    const index = this.check.positions.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid position id:" + data);
    }

    this.check.positions[index] = data;
    this.positionsDataSource.data = this.check.positions;
  }

  deletePosition(data: Position) {
    const index = this.check.positions.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid position id:" + data);
    }

    this.check.positions.splice(index, 1);
    this.positionsDataSource.data = this.check.positions;
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
      } else if (result.event == 'Delete') {
        this.deletePayment(result.data);
      }
    });
  }

  addPayment(data: Payment) {
    this.check.payments.push(new Payment({
      internalId: this.check.positions.length + 1,
      amount: data.amount,
      user: data.user
    }));

    this.paymentsDataSource.data = this.check.payments;
    this.openSnackBar("Payment was added!");
  }

  updatePayment(data: Payment) {
    const index = this.check.payments.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid payment id:" + data);
    }

    this.check.payments[index] = data;
    this.paymentsDataSource.data = this.check.payments;
  }

  deletePayment(data: Payment) {
    const index = this.check.payments.findIndex(p => p.internalId === data.internalId);
    if (index == -1) {
      console.log("Invalid payment id:" + data);
    }

    this.check.payments.splice(index, 1);
    this.paymentsDataSource.data = this.check.payments;
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

  canBeCreated(): boolean {
    return !isNullOrUndefined(this.check.payments) &&
      this.check.payments.length != 0 &&
      !isNullOrUndefined(this.check.positions) &&
      this.check.positions.length != 0 &&
      this.check.title != '';
  }

  createCheck() {
    this.balanceApiService.createCheck(this.check)
      .pipe(finalize(() => { debugger }))
      .subscribe(
        (response: any) => { debugger },
        (error: any) => {
          debugger
        }
      );;
  }
}
