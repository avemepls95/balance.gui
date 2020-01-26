import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Payment } from 'src/app/Model/Payment';
import { Position } from 'src/app/Model/Position';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config, pipe } from 'rxjs';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { Check } from 'src/app/Model/Check';
import { isNullOrUndefined, isNumber } from 'util';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { LoaderService } from 'src/app/Services/loader.service';
import { CheckCreateUpdateDtoMapper } from 'src/app/Model/Utils/CheckCreateUpdateDtoMapper';
import { SnackBarColor } from 'src/app/ControlLayer/SnackBarColor.enum'
import { ResponseCode } from 'src/app/Utils/ResponseCode.enum';
import { SnackbarOptions } from 'src/app/ControlLayer/SnackbarOptions';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { PositionCardComponent } from '../position-card/position-card.component';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
})
export class CheckComponent implements OnInit, OnDestroy {
  titleFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  positionsDisplayedColumns: string[] = ['index', 'title', 'amount', 'actions'];
  positionsDataSource: MatTableDataSource<Position>;

  paymentsDisplayedColumns: string[] = ['index', 'username', 'amount', 'actions'];
  paymentsDataSource: MatTableDataSource<Payment>;

  check: Check;

  mode: string = 'creating';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private balanceApiService: BalanceApiService,
    private snackbar: MatSnackBar,
    activateRoute: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService
  ) {
    snackbarService.setSnackbar(snackbar);

    let state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state))
      this.check = state.check;
    else
      this.check = new Check();

    this.positionsDataSource = new MatTableDataSource(this.check.positions);
    this.paymentsDataSource = new MatTableDataSource(this.check.payments);

    if (!isNullOrUndefined(state))
      return;
      
    activateRoute.params.subscribe(params => {
      if (!isNullOrUndefined(params['id'])) {
        if (+params['id']) {
          this.mode = 'editing';
          loaderService.show();
          balanceApiService.getCheckById(params['id']).subscribe(
            result => {
              this.check = CheckGetDtoMapper.convertDtoToCheck(result.data);
              this.positionsDataSource = new MatTableDataSource(this.check.positions);
              this.paymentsDataSource = new MatTableDataSource(this.check.payments);
              loaderService.hide();
            },
            (httpErrorResponse: HttpErrorResponse ) => {
              loaderService.hide();
              if (httpErrorResponse.error.error.code == 'check_not_found')
                snackbarService.showErrorMessage(null, 'Error. Check not found');
            }
          );
        } else {
          // TODO: handle incorrect id
        }
      }
    });
  }

  ngOnInit() {
    this.positionsDataSource.paginator = this.paginator;
    this.positionsDataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.snackbar.ngOnDestroy();
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
      obj: Object.assign({}, obj),
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
      consumptions: data.consumptions
    }));

    this.positionsDataSource.data = this.check.positions;
    this.snackbarService.openSnackBar(new SnackbarOptions({ message: "Position was added!" }));
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
    this.snackbarService.openSnackBar(new SnackbarOptions({ message: "Payment was added!" }));
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

  createCheck() {
    if (isNullOrUndefined(this.check.title) || this.check.title == '') {
      this.titleFormControl.markAsTouched();
      return;
    }

    let checkDto = CheckCreateUpdateDtoMapper.convertCheckToDto(this.check);
    this.loaderService.show();
    this.balanceApiService.createCheck(checkDto)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: BalanceResponse) => {
          this.check = CheckGetDtoMapper.convertDtoToCheck(response.data);
          this.snackbarService.showSuccessMessage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.snackbarService.showErrorMessage(errorResponse);
        }
      );
  }

  updateCheck() {
    let checkDto = CheckCreateUpdateDtoMapper.convertCheckToDto(this.check);
    this.loaderService.show();
    this.balanceApiService.updateCheck(checkDto)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: BalanceResponse) => {
          this.check = CheckGetDtoMapper.convertDtoToCheck(response.data);
          debugger
          this.snackbarService.showSuccessMessage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.snackbarService.showErrorMessage(errorResponse);
        }
      );
  }

  processCheck() {
    this.loaderService.show();
    this.balanceApiService.processCheck(this.check.id)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: BalanceResponse) => {
          this.check = CheckGetDtoMapper.convertDtoToCheck(response.data);
          this.mode = "editing";
          this.snackbarService.showSuccessMessage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.snackbarService.showErrorMessage(errorResponse);
        }
      );
  }

  rollbackCheck() {
    this.loaderService.show();
    this.balanceApiService.rollbackCheck(this.check.id)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: BalanceResponse) => {
          this.check = CheckGetDtoMapper.convertDtoToCheck(response.data);
          this.snackbarService.showSuccessMessage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.snackbarService.showErrorMessage(errorResponse);
        }
      );
  }

}
