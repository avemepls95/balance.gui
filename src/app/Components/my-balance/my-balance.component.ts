import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { Debt } from 'src/app/Model/Debt';
import { DebtsDtoMapper } from 'src/app/Model/Utils/DebtsDtoMapper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-my-balance',
  templateUrl: './my-balance.component.html',
  styleUrls: ['./my-balance.component.css']
})
export class MyBalanceComponent implements OnInit {

  debts: Debt[];
  totalAmount: number = 0;

  displayedColumns: string[] = ['index', 'username', 'amount'];
  dataSource: MatTableDataSource<Debt>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    balanceApiService: BalanceApiService,
    loaderService: LoaderService,
  ) {

    loaderService.show();
    balanceApiService.getDebts().pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.debts = response.data.map(d => DebtsDtoMapper.convertDtoToDebt(d))
        this.totalAmount = this.debts.reduce((sum, current) => sum + current.amount, 0);
        this.dataSource = new MatTableDataSource(this.debts);
        this.dataSource.sort = this.sort;
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
