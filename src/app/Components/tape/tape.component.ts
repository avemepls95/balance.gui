import { Component, OnInit } from '@angular/core';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { TapeRecord } from 'src/app/Model/TapeRecord';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.css']
})
export class TapeComponent implements OnInit {

  records: TapeRecord[];

  currentUserId: number;

  constructor(
    private balanceApiService: BalanceApiService,
    private snackbar: MatSnackBar,
    private router: Router,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService
  ) {
    snackbarService.setSnackbar(snackbar);
    this.currentUserId = (Number)(localStorage.getItem(LocalStorageManager.userIdKey));

    loaderService.show();
    balanceApiService.getTape().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.records = response.data.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
      },
      (error) => console.error(error)
    );
   }

  ngOnInit() {
  }

  openCheck(checkId: number) {
    this.balanceApiService.getCheckById(checkId).subscribe(
      result => {
        this.loaderService.hide();
        let check = CheckGetDtoMapper.convertDtoToCheck(result.data);
        this.router.navigateByUrl('/editCheck/' + checkId, { state: { check }});
      },
      (httpErrorResponse: HttpErrorResponse ) => {
        this.loaderService.hide();
        if (httpErrorResponse.error.error.code == 'check_not_found')
          this.snackbarService.showErrorMessage(null, 'Error. Check not found');
      }
    );
  }
}
