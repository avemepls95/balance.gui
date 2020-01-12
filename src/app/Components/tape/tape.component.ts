import { Component, OnInit } from '@angular/core';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { DebtsDtoMapper } from 'src/app/Model/Utils/DebtsDtoMapper';
import { MatTableDataSource } from '@angular/material/table';
import { Debt } from 'src/app/Model/Debt';
import { TapeRecord } from 'src/app/Model/TapeRecord';
import { TapeRecordDto } from 'src/app/Model/Dto/TapeRecordDto';
import { TapeRecordType } from 'src/app/Model/TapeRecordType.enum';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.css']
})
export class TapeComponent implements OnInit {

  records: TapeRecord[];

  constructor(
    private loaderService: LoaderService,
    private balanceApiService: BalanceApiService
  ) {
    loaderService.show();
    balanceApiService.getTape().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.records = response.data.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
        console.log(this.records)
      },
      (error) => console.error(error)
    );
   }

  ngOnInit() {
  }

  processTapeRecordDto(record: TapeRecordDto) {
    // if (record.type == TapeRecordType.TransferRegistered) {
    //   this.balanceApiService.
    // }
  }
}
