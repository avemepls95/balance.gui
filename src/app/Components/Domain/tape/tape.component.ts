import { Component, OnInit } from '@angular/core';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { TapeRecord } from 'src/app/Model/TapeRecord';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { CheckGetDtoMapper } from 'src/app/Model/Utils/CheckGetDtoMapper';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.css']
})
export class TapeComponent implements OnInit {

  records: TapeRecord[];

  currentUserId: number;
  noRecords: boolean;

  private recordsCountToShowInitially: number = 10;
  private recordsCountToLoad: number = 5;
  private loadedRecordsCount: number = 0;

  isLoading: boolean = false;

  constructor(
    private balanceApiService: BalanceApiService,
    snackbar: MatSnackBar,
    private router: Router,
    private loaderService: LoaderService,
    snackbarService: SnackbarService,
    private spinner: NgxSpinnerService
  ) {
    snackbarService.setSnackbar(snackbar);
    this.currentUserId = (Number)(localStorage.getItem(LocalStorageManager.userIdKey));

    loaderService.show();
    
    balanceApiService.getTape(0, this.recordsCountToShowInitially).pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        if (response.data.length == 0)
          this.noRecords = true;

        this.records = response.data;
        this.loadedRecordsCount += response.data.length;
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  openCheck(checkId: number) {
    this.loaderService.show();
    this.balanceApiService.getCheckById(checkId).pipe()
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        result => {
          let check = CheckGetDtoMapper.convertDtoToCheck(result.data);
          this.router.navigateByUrl('/editCheck/' + checkId, { state: { check } });
        }
      );
  }

  onScroll() {
    this.spinner.show();
    this.isLoading = true;

    this.balanceApiService.getTape(this.loadedRecordsCount, this.recordsCountToLoad).pipe(
      finalize(() => {
        this.spinner.hide();
        this.isLoading = false;
      })
    ).subscribe(
      (response) => {
        this.records = this.records.concat(response.data);
        this.loadedRecordsCount += response.data.length;
      },
      (error) => console.error(error)
    );
  }
}
