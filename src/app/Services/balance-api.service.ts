import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { CreateUpdateCheckDto } from '../Model/Dto/Check/CreateUpdate/CreateUpdateCheckDto';

@Injectable({
  providedIn: 'root'
})
export class BalanceApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = 'http://localhost:8081/';
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

  getAllChecks(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'checks');
  }

  getCheckById(id: number): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString());

    return this.http.get(this.apiBaseUrl + 'checks', { params });
  }

  updateCheck(check: CreateUpdateCheckDto): Observable<any> {
    if (isNullOrUndefined(check))
      throw Error("Cannot update a check. Passed parameter is null or indefined.");

    return this.http.put(
      this.apiBaseUrl + 'checks/' + check.id.toString(),
      check
    );
  }
}
