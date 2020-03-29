import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Payment } from 'src/app/Model/Payment';
import { Position } from 'src/app/Model/Position';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { Check } from 'src/app/Model/Check';
import { isNullOrUndefined } from 'util';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { LoaderService } from 'src/app/Services/loader.service';
import { CheckCreateUpdateDtoMapper } from 'src/app/Model/Utils/CheckCreateUpdateDtoMapper';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { PositionCardComponent } from '../position-card/position-card.component';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Components/Common/confirm-dialog/confirm-dialog.component';
import { CopyUtils } from 'src/app/Utils/CopyUtils';
import { CheckPermissionsResolver } from 'src/app/Model/Utils/CheckPermissionsResolver';
import { TableUtils } from 'src/app/ControlLayer/Utils/TableUtils';
import { CHECK_STATE as CHECK_STATE } from 'src/app/Model/check-state.enum';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
})
export class CheckComponent implements OnInit, OnDestroy {
  titleFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  positionsDisplayedColumns: string[] = ['index', 'title', 'amount', 'actions'];
  positionsDataSource: MatTableDataSource<Position>;

  paymentsDisplayedColumns: string[] = ['index', 'username', 'amount', 'actions'];
  paymentsDataSource: MatTableDataSource<Payment>;

  unmodifiedCheck: Check;
  check: Check;

  mode: string = 'creating';

  permissionsResolver: CheckPermissionsResolver = new CheckPermissionsResolver();
  hasEditPermissions: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  CHECK_STATE = CHECK_STATE;

  constructor(
    public dialog: MatDialog,
    private balanceApiService: BalanceApiService,
    private snackbar: MatSnackBar,
    activateRoute: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private translateHelper: TranslateHelper,
    private copyUtils: CopyUtils
  ) {
    snackbarService.setSnackbar(snackbar);

    let state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.mode = 'editing';
      this.setCurrentCheck(state.check);
    }
    else {
      this.setCurrentCheck(new Check());
    }

    this.positionsDataSource = new MatTableDataSource(this.check.positions);
    this.paymentsDataSource = new MatTableDataSource(this.check.payments);

    if (!isNullOrUndefined(state))
      return;

    activateRoute.params.subscribe(params => {
      if (!isNullOrUndefined(params['id'])) {
        if (+params['id']) {
          this.mode = 'editing';
          loaderService.show();
          balanceApiService.getCheckById(params['id'])
            .pipe(finalize(() => {
              this.loaderService.hide();
            }))
            .subscribe(
              result => {
                var tmp = CheckGetDtoMapper.convertDtoToCheck(result.data);
                
                let internalId = 0;
                tmp.positions.forEach(position => position.internalId = ++internalId);
                internalId = 0;
                tmp.payments.forEach(payment => payment.internalId = ++internalId);

                this.setCurrentCheck(tmp);

                this.positionsDataSource = new MatTableDataSource(this.check.positions);
                this.paymentsDataSource = new MatTableDataSource(this.check.payments);
                loaderService.hide();
              }
            );
        } else {
          // TODO: handle incorrect id
        }
      }
    });
  }

  ngOnInit() {
    this.positionsDataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.snackbar.ngOnDestroy();
  }

  openPositionCard(action, obj) {
    let data = {
      obj: this.copyUtils.deepCopy(obj),
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
    let message: string = this.translateHelper.getValue('check.positionWasAdded') + '!';
    this.snackbarService.showMessage(message);
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
    let message: string = this.translateHelper.getValue('check.paymentWasAdded') + '!';
    this.snackbarService.showMessage(message);
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
          let check = CheckGetDtoMapper.convertDtoToCheck(response.data);
          this.setCurrentCheck(check);
          this.router.navigateByUrl('/editCheck/' + response.data.id, { state: { check } });
          this.snackbarService.showSuccessMessage();
        }
      );
  }

  handleUpdateCheckClick() {
    if (this.stateHasChanges()) {
      this.updateCheck();
      return;
    }

    let message = this.translateHelper.getValue('check.noChanges');
    this.snackbarService.showInformationMessage(message);
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
          this.setCurrentCheck(CheckGetDtoMapper.convertDtoToCheck(response.data));
          this.snackbarService.showSuccessMessage();
        }
      );
  }

  handleProcessCheckClick() {
    if (!this.stateHasChanges()) {
      this.processCheck();
      return;
    }

    const dialogData = new ConfirmDialogModel(
      this.translateHelper.getValue('common.confirmation'),
      this.translateHelper.getValue('check.processWithUnsavedChanges'));

    this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    })
      .afterClosed().subscribe(dialogResult => {
        if (!dialogResult)
          return;

        this.processCheck();
      });
  }

  private processCheck() {
    this.loaderService.show();
    this.balanceApiService.processCheck(this.check.id)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: BalanceResponse) => {
          this.setCurrentCheck(CheckGetDtoMapper.convertDtoToCheck(response.data));
          this.mode = "editing";
          this.snackbarService.showSuccessMessage();
        }
      );
  }

  rollbackCheck() {
    const dialogData = new ConfirmDialogModel(
      this.translateHelper.getValue('common.confirmation'),
      this.translateHelper.getValue('check.rollbackConfirmation'));
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      this.loaderService.show();
      this.balanceApiService.rollbackCheck(this.check.id)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(
          (response: BalanceResponse) => {
            this.setCurrentCheck(CheckGetDtoMapper.convertDtoToCheck(response.data));
            this.snackbarService.showSuccessMessage();
          }
        );
    });
  }

  getPositionsTotalAmount(): number {
    let amounts = this.check.positions.map(t => +t.amount);
    let totalAmount = amounts.reduce((acc, value) => acc + value, 0);

    return Math.round(totalAmount * 100) / 100;
  }

  setCurrentCheck(check: Check): void {
    this.check = check;
    this.unmodifiedCheck = this.copyUtils.deepCopy(check);
    this.permissionsResolver.setPermissionsObject(check);
    this.hasEditPermissions = this.permissionsResolver.canEdit();

    this.updateColumns();
  }

  stateHasChanges(): boolean {
    let unmodifiedCheckJson = JSON.stringify(this.unmodifiedCheck);
    let currentCheckJson = JSON.stringify(this.check);

    var result = unmodifiedCheckJson != currentCheckJson;
    return result;
  }

  canRollback(): boolean {
    let result = this.check.state == CHECK_STATE.PROCESSED && this.hasEditPermissions;
    return result;
  }

  canEdit(): boolean {
    if (!this.check.state)
      return true;

    let result = this.check.state == CHECK_STATE.EDITING && this.hasEditPermissions;
    return result;
  }

  updateColumns() {
    TableUtils.setColumnVisible(this.positionsDisplayedColumns, 'actions', this.canEdit());
    TableUtils.setColumnVisible(this.paymentsDisplayedColumns, 'actions', this.canEdit());
  }

  getCurrentStatus(): string {
    var status = this.check.state == CHECK_STATE.EDITING ?
      this.translateHelper.getValue('check.editingStatus') :
      this.translateHelper.getValue('check.processedStatus')

    return status;
  }
}
