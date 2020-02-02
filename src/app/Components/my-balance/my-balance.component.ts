import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { Debt } from 'src/app/Model/Debt';
import { DebtsDtoMapper } from 'src/app/Model/Utils/DebtsDtoMapper';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TransferCardComponent } from '../transfer-card/transfer-card.component';
import { MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { SnackbarOptions } from 'src/app/ControlLayer/SnackbarOptions';
import { SnackBarColor } from 'src/app/ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from 'src/app/Utils/ResponseCode.enum';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { TransferDto } from 'src/app/Model/Dto/TransferDto';
import { UUID } from 'angular2-uuid';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-balance',
  templateUrl: './my-balance.component.html',
  styleUrls: ['./my-balance.component.css']
})
export class MyBalanceComponent implements OnInit {

  debts: Debt[] = [];
  totalAmount: number = 0;

  displayedColumns: string[] = ['index', 'username', 'amount', 'actions'];
  dataSource: MatTableDataSource<Debt>;

  isZeroBalance: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private snackbar: MatSnackBar,
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {
    snackbarService.setSnackbar(snackbar);

    loaderService.show();
    balanceApiService.getDebts().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        if (response.data.length == 0 || response.data.length == response.data.filter(debt => debt.value == 0).length) {
          this.isZeroBalance = true;
          return;
        }

        let tmp = response.data.map(d => DebtsDtoMapper.convertDtoToDebt(d)) as Debt[];
        tmp.forEach(debt => {
          if (debt.amount != 0)
            this.debts.push(debt);
        });

        this.totalAmount = this.debts.reduce((sum, current) => sum + current.amount, 0);
        this.dataSource = new MatTableDataSource(this.debts);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (debt: Debt, filter: string): boolean {
          return debt.user.username.toLowerCase().includes(filter) ||
            debt.amount.toString().toLowerCase().includes(filter);
        };
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTotalAmount(): number {
    if (isNullOrUndefined(this.dataSource) || isNullOrUndefined(this.dataSource.filteredData))
      return this.totalAmount;

    return this.dataSource.filteredData.reduce((sum, current) => sum + current.amount, 0);
  }

  openTransferCard(debt: Debt) {
    const dialogRef = this.dialog.open(TransferCardComponent, {
      data: debt
    });

    dialogRef.afterClosed().subscribe(data => {
      if (isNullOrUndefined(data))
        return;

      let transferDto = new TransferDto({
        id: UUID.UUID(),
        amount: data.amount,
        recipientId: debt.user.id
      });

      this.loaderService.show();
      this.balanceApiService.registerTransfer(transferDto)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(
          (response: BalanceResponse) => {
            debt.amount += +data.amount;
            if (this.debts.filter(d => d.amount == 0).length == this.debts.length)
              this.isZeroBalance = true;

            this.snackbarService.showSuccessMessage()
          },
          (errorResponse: HttpErrorResponse) => {
            this.snackbarService.showErrorMessage(errorResponse);
          }
        );

    });
  }

}
