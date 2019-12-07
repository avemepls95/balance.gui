import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Check } from '../Model/Check';
import { isNullOrUndefined } from 'util';
import { ParamsMapper } from '../Model/Utils/ParamsMapper';

@Injectable({
  providedIn: 'root'
})
export class BalanceApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = 'http://localhost:8081/';
  }

  getUsersSuggestion(query: string) : Observable<any> {
    if (query == "" || query == undefined)
      return EMPTY;

    const params = new HttpParams()
      .set('query', query);

    return this.http.get(this.apiBaseUrl + 'users/search', { params });
  }

  createCheck(check: Check) : Observable<any> {
    if (isNullOrUndefined(check))
      throw Error("Cannot create a check. Passed parameter is null or indefined.");

    return this.http.post(
      this.apiBaseUrl + 'checks',
      ParamsMapper.convertCheckToCheckDto(check)
    );
  }
}
