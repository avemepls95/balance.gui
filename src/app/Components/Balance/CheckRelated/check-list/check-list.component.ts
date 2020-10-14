import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Check } from 'src/app/Model/Balance/Check';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BalanceResponse } from 'src/app/Model/Balance/BalanceResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Components/Common/confirm-dialog/confirm-dialog.component';
import { TableUtils } from 'src/app/ControlLayer/Utils/TableUtils';
import { isNullOrUndefined } from 'util';
import { UserCheckRoles } from 'src/app/Model/Balance/Utils/CheckPermissionsResolver';
import { CHECK_STATE } from 'src/app/Model/Balance/check-state.enum';
import { CheckGetDtoMapper } from 'src/app/Model/Balance/Utils/CheckGetDtoMapper';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  checks: Check[];

  displayedColumns: string[] = ['createdAt', 'title'];

  itemsPerPage: number = 5;
  noMoreItems = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  CHECK_STATE = CHECK_STATE;

  constructor(
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    snackbar: MatSnackBar) {

    snackbarService.setSnackbar(snackbar);

    loaderService.show();
    balanceApiService.findChecks(0, this.itemsPerPage).pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.checks = response.data.map(c => CheckGetDtoMapper.convertDtoToCheck(c));

        this.updateColumns();
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  loadNextSet(): void {
    const skip = this.checks.length;
    this.loaderService.show();
    this.balanceApiService.findChecks(skip, this.itemsPerPage).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe(
      (response: BalanceResponse) => {
        if (response.data.length == 0) {
          this.noMoreItems = true;
          return;
        }

        let checks = response.data.map(c => CheckGetDtoMapper.convertDtoToCheck(c));

        this.checks = this.checks.concat(checks);
        this.updateColumns();
      },
      (error) => console.error(error)
    );
  }

  deleteCheck(id: number) {
    const index = this.checks.findIndex(c => c.id === id);
    if (index == -1) {
      console.log("Invalid check id:" + id);
    }

    const dialogData = new ConfirmDialogModel('Подтверждение', 'Вы уверены, что хотите удалить чек?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      this.loaderService.show();
      this.balanceApiService.deleteCheck(id)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(
          (response: BalanceResponse) => {
            this.snackbarService.showSuccessMessage();
            var deleted = this.checks.splice(index, 1)[0];
            // reinitialize for grid updating
            this.checks = this.checks.filter(c => !this.checks.includes(deleted));

            this.updateColumns();
          }
        );
    });
  }

  checkActionsVisible(checkId: number): boolean {
    let check = this.checks.find(c => c.id == checkId);
    if (isNullOrUndefined(check)) {
      throw Error(`Check with Id = ${checkId} not found.`)
    }

    let result =
      check.state != CHECK_STATE.PROCESSED &&
      !!check.roles &&
      check.roles.includes(UserCheckRoles.Owner)

    return result;
  }

  updateColumns() {
    let allChecksProcessed =
      this.checks.filter(c => c.state == CHECK_STATE.PROCESSED).length == this.checks.length;

    if (allChecksProcessed)
      TableUtils.setColumnVisible(this.displayedColumns, 'actions', false);

    let unprocessedChecksWhereOwner = this.checks.filter(c =>
      !!c.roles &&
      c.roles.includes(UserCheckRoles.Owner) &&
      c.state != CHECK_STATE.PROCESSED
    );

    let hasAccessForAnyUnprocessedCheckActions = unprocessedChecksWhereOwner.length != 0;
    TableUtils.setColumnVisible(this.displayedColumns, 'actions', hasAccessForAnyUnprocessedCheckActions);
  }
}
