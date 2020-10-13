import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
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
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { LoaderService } from 'src/app/Services/loader.service';
import { CheckCreateUpdateDtoMapper } from 'src/app/Model/Utils/CheckCreateUpdateDtoMapper';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { PositionCardComponent } from '../position-card/position-card.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Components/Common/confirm-dialog/confirm-dialog.component';
import { CopyUtils } from 'src/app/Utils/CopyUtils';
import { CheckPermissionsResolver } from 'src/app/Model/Utils/CheckPermissionsResolver';
import { TableUtils } from 'src/app/ControlLayer/Utils/TableUtils';
import { CHECK_STATE as CHECK_STATE } from 'src/app/Model/check-state.enum';
import { MathExtensions } from 'src/app/Utils/MathExtensions';
import { MatRadioChange } from '@angular/material/radio';
import { DISCOUNT_TYPE } from 'src/app/Model/Discount/discount-type.enum';
import { DiscountCalculator } from 'src/app/Model/Discount/discount-calculator';
import { DiscountPercentCalculator } from 'src/app/Model/Discount/discount-percent-calculator';
import { DiscountAbsCalculator } from 'src/app/Model/Discount/discount-abs-calculator';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
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
  CHECK_STATE = CHECK_STATE;
  DISCOUNT_TYPE: DISCOUNT_TYPE;
  discountCalculator: DiscountCalculator = new DiscountAbsCalculator();

  mode: string = 'creating';

  permissionsResolver: CheckPermissionsResolver = new CheckPermissionsResolver();
  hasEditPermissions: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @HostListener('window:beforeunload',['$event'])
  showMessage($event) {
    if (this.stateHasChanges())
      $event.returnValue='Your data will be lost!';
  }

  constructor(
    public dialog: MatDialog,
    private balanceApiService: BalanceApiService,
    private snackbar: MatSnackBar,
    activateRoute: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private copyUtils: CopyUtils
  ) {
    snackbarService.setSnackbar(snackbar);

    let state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.mode = 'editing';
      
      this.setCurrentCheckAndRelatedEntities(state.check);
      this.discountCalculator.recalculateCheckWithoutDiscount();
    }
    else {
      this.setCurrentCheckAndRelatedEntities(new Check());
      this.unmodifiedCheck = this.copyUtils.deepCopy(this.check);
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

                this.setCurrentCheckAndRelatedEntities(tmp);
                this.discountCalculator.recalculateCheckWithoutDiscount();
                // Копирование должно быть после расчета сумм без скидок
                this.unmodifiedCheck = this.copyUtils.deepCopy(this.check);

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

  openPositionCard(action, position) {
    let data = {
      action: action,
      position: this.copyUtils.deepCopy(position),
      discount: this.check.discount,
      discountCalculator: this.discountCalculator,
      newInternalId: this.check.positions.length + 1
    }

    if (this.check.positions.length != 0) {
      data['predefinedUsers'] =
        this.check.positions[this.check.positions.length - 1].consumptions.map(c => c.user)
    }

    const dialogRef = this.dialog.open(PositionCardComponent, {
      width: '370px',
      data: data
    });

    dialogRef.afterClosed().subscribe((result = 'Cancel') => {
      if (result.event == 'Add') {
        this.addPosition(result.data);
      } else if (result.event == 'Edit') {
        this.updatePosition(result.data);
      } else if (result.event == 'Delete') {
        this.deletePosition(result.data);
      }

      if (result.event != 'Cancel' && this.check.discount.apply)
        this.discountCalculator.recalculateCheckWithDiscount();
    });
  }

  addPosition(position: Position) {
    this.check.positions.push(new Position({
      internalId: position.internalId,
      title: position.title,
      amount: position.amount,
      consumptions: position.consumptions,
      applyDiscount: position.applyDiscount,
      amountWithoutDiscount: position.amountWithoutDiscount
    }));

    this.positionsDataSource.data = this.check.positions;
    this.snackbarService.showMessage('Позиция добавлена!');
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

    dialogRef.afterClosed().subscribe((result = 'Cancel') => {
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
    this.snackbarService.showMessage('Платеж добавлен!');
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
          this.setCurrentCheckAndRelatedEntities(check);
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

    this.snackbarService.showInformationMessage('Нет изменений');
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
          this.setCurrentCheckAndRelatedEntities(CheckGetDtoMapper.convertDtoToCheck(response.data));
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
      'Подтверждение',
      'В чеке есть несохраненные изменения. Уверены, что хотите обработать старую версию?');

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
          this.setCurrentCheckAndRelatedEntities(CheckGetDtoMapper.convertDtoToCheck(response.data));
          this.mode = "editing";
          this.snackbarService.showSuccessMessage();
        }
      );
  }

  rollbackCheck() {
    const dialogData = new ConfirmDialogModel('Подтверждение', 'Вы уверены, что хотите откатить чек?');
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
            this.setCurrentCheckAndRelatedEntities(CheckGetDtoMapper.convertDtoToCheck(response.data));
            this.snackbarService.showSuccessMessage();
          }
        );
    });
  }

  getPositionsTotalAmount(): number {
    let amounts = this.check.positions.map(t => +t.amount);
    let totalAmount = amounts.reduce((acc, value) => acc + value, 0);

    return MathExtensions.round(totalAmount, 2);
  }

  setCurrentCheckAndRelatedEntities(check: Check): void {
    this.check = check;
    this.updateInternalIds(this.check);

    this.discountCalculator = check.discount.type == DISCOUNT_TYPE.PERCENT ?
        new DiscountPercentCalculator() : new DiscountAbsCalculator();

    this.discountCalculator.setCheck(check);
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

  canProcess(): boolean {
    let result = this.check.isReadyForProcess && this.hasEditPermissions;
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
    var status = this.check.state == CHECK_STATE.EDITING ? 'В работе' : 'Обработан';
    return status;
  }

  onDiscountApplyChange(event): void {
    if (!event.checked) {
      this.check.discount.value = 0;
      this.discountCalculator.recalculateCheckWithDiscount();

      return;
    }
  }

  onDiscountValueChange(event): void {
    var result = +event.target.value;

    this.discountCalculator.setDiscountValue(result);
    this.discountCalculator.recalculateCheckWithDiscount();

    if (result == 0)
      this.check.discount.apply = false;
  }

  onBlurMethod(event) {
    if (event.target.value === '')
      this.check.discount.apply = false;
  }

  onDiscountTypeChange(event: MatRadioChange): void {
    this.check.discount.type = event.value as DISCOUNT_TYPE;
    this.discountCalculator = this.check.discount.type == DISCOUNT_TYPE.PERCENT ?
      new DiscountPercentCalculator() : new DiscountAbsCalculator();
    this.discountCalculator.setCheck(this.check);

    if (this.check.discount.value == 0)
      return;

    this.discountCalculator.recalculateCheckWithDiscount();
  }

  updateInternalIds(check: Check): void {
    let internalId = 0;
    check.positions.forEach(position => position.internalId = ++internalId);
    internalId = 0;
    check.payments.forEach(payment => payment.internalId = ++internalId);
  }
}
