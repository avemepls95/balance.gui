import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/Services/loader.service';
import { finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { Debt } from 'src/app/Model/Debt';
import { DebtsDtoMapper } from 'src/app/Model/Utils/DebtsDtoMapper';

@Component({
  selector: 'app-my-balance',
  templateUrl: './my-balance.component.html',
  styleUrls: ['./my-balance.component.css']
})
export class MyBalanceComponent implements OnInit {

  debts: Debt[];

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
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

}
