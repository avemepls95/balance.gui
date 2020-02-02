import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Check } from 'src/app/Model/Check';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../Common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  checks: Check[];

  displayedColumns: string[] = ['index', 'title', 'actions'];
  dataSource: MatTableDataSource<Check>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar) {

    snackbarService.setSnackbar(snackbar);
    loaderService.show();
    balanceApiService.getAllChecks().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.checks = response.data.map(c => CheckGetDtoMapper.convertDtoToCheck(c))
        this.dataSource = new MatTableDataSource(this.checks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCheck(id: number) {
    const index = this.checks.findIndex(p => p.id === id);
    if (index == -1) {
      console.log("Invalid check id:" + id);
    }
    let check = this.checks[index];
    const message = 'Sure to delete check \'' + check.title + '\'?';

    const dialogData = new ConfirmDialogModel("Confirm Delete", message);

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
            this.checks.splice(index, 1);
            this.dataSource.data = this.checks;
          },
          (errorResponse: HttpErrorResponse) => {
            this.snackbarService.showErrorMessage(errorResponse);
          }
        );
    });
  }
}
