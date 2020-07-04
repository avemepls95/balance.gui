import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY, of } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { CreateUpdateCheckDto } from '../Model/Dto/Check/CreateUpdate/CreateUpdateCheckDto';
import { BalanceResponse } from '../BalanceResponse';
import { TransferDto } from '../Model/Dto/TransferDto';
import { environment } from 'src/environments/environment';
import { DebtRepaidDto } from '../Model/Dto/DebtRepaidDto';

@Injectable({
  providedIn: 'root'
})
export class BalanceApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiUrl;
  }

  getUsersSuggestion(query: string): Observable<any> {
    if (query == "" || query == undefined)
      return EMPTY;

    const params = new HttpParams()
      .set('query', query);

    return this.http.get(this.apiBaseUrl + 'users/search', { params });
  }

  createCheck(check: CreateUpdateCheckDto): Observable<any> {
    if (isNullOrUndefined(check))
      throw Error("Cannot create a check. Passed parameter is null or indefined.");

    return this.http.post(
      this.apiBaseUrl + 'checks',
      check
    );
  }

  findChecks(skip: number, take: number): Observable<BalanceResponse> {
    const params = new HttpParams()
      .set('offset', skip.toString())
      .set('limit', take.toString());
    
    return this.http.get(this.apiBaseUrl + 'checks', { params }) as Observable<BalanceResponse>;
  }

  getCheckById(id: number): Observable<BalanceResponse> {
    return this.http.get(this.apiBaseUrl + 'checks/' + id.toString()) as Observable<BalanceResponse>;
  }

  updateCheck(check: CreateUpdateCheckDto): Observable<BalanceResponse> {
    if (isNullOrUndefined(check))
      throw Error("Cannot update a check. Passed parameter is null or indefined.");

    return this.http.put(
      this.apiBaseUrl + 'checks/' + check.id.toString(),
      check
    ) as Observable<BalanceResponse>;
  }

  deleteCheck(id: number): Observable<BalanceResponse> {
    return this.http.delete(this.apiBaseUrl + 'checks/' + id.toString()) as Observable<BalanceResponse>;
  }

  processCheck(checkId: number): Observable<BalanceResponse> {
    return this.http.post(
      this.apiBaseUrl + 'checks/' + checkId.toString() + '/process',
      {}
    ) as Observable<BalanceResponse>;
  }

  rollbackCheck(checkId: number): Observable<BalanceResponse> {
    return this.http.post(
      this.apiBaseUrl + 'checks/' + checkId.toString() + '/rollback',
      {}
    ) as Observable<BalanceResponse>;
  }

  getDebts(): Observable<BalanceResponse> {
    return this.http.get(this.apiBaseUrl + 'balances') as Observable<BalanceResponse>;
  }

  registerTransfer(transferDto: TransferDto) {
    if (isNullOrUndefined(transferDto))
      throw Error("Cannot register a transfer. Passed parameter is null or undefined.");

    return this.http.post(
      this.apiBaseUrl + 'transfers',
      transferDto
    ) as Observable<BalanceResponse>;
  }

  commitDebtRepaid(debtRepaidDto: DebtRepaidDto) {
    if (isNullOrUndefined(debtRepaidDto))
      throw Error("Cannot commit that debt repaid. Passed parameter is null or undefined.");

    return this.http.post(
      this.apiBaseUrl + 'debts/forgive',
      debtRepaidDto
    ) as Observable<BalanceResponse>;
  }

  getTape(skip: number, take: number) : Observable<BalanceResponse> {
    const params = new HttpParams()
      .set('offset', skip.toString())
      .set('limit', take.toString());
      
    return this.http.get(this.apiBaseUrl + 'news', { params }) as Observable<BalanceResponse>;
  }

  remind(debtorId: number) : Observable<BalanceResponse> {
    const params = new HttpParams()
      .set('debtorId', debtorId.toString());
      
    return this.http.post(this.apiBaseUrl + 'debts/remind', { debtorId }) as Observable<BalanceResponse>;
  }
}
