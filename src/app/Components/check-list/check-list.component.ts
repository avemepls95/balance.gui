import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Check } from 'src/app/Model/Check';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { ParamsMapper } from 'src/app/Model/Utils/ParamsMapper';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css']
})
export class CheckListComponent implements OnInit {

  checks: Check[];

  displayedColumns: string[] = ['index', 'title', 'actions'];
  dataSource: MatTableDataSource<Check>;

  constructor(private balanceApiService: BalanceApiService, public loaderService: LoaderService) {
    loaderService.show();
    balanceApiService.getAllChecks().pipe(
      finalize(() => loaderService.hide() )
    ).subscribe(
      (response) => {
        this.checks = response.data.map(c => ParamsMapper.convertCheckDtoToCheck(c))
        this.dataSource = new MatTableDataSource(this.checks);
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

}
