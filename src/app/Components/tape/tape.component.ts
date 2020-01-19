import { Component, OnInit } from '@angular/core';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { TapeRecord } from 'src/app/Model/TapeRecord';
import { LocalStorageManager } from 'src/app/LocalStorageManager';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.css']
})
export class TapeComponent implements OnInit {

  records: TapeRecord[];

  currentUserId: number;

  constructor(
    loaderService: LoaderService,
    balanceApiService: BalanceApiService
  ) {
    this.currentUserId = (Number)(localStorage.getItem(LocalStorageManager.userIdKey));

    loaderService.show();
    balanceApiService.getTape().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.records = response.data.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
        debugger
      },
      (error) => console.error(error)
    );
   }

  ngOnInit() {
  }
}
