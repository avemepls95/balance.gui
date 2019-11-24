import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = 'http://localhost:8081/';
  }

  getUsersSuggestion(query: string): Observable<any> {
    if (query == "")
      return EMPTY;

    const params = new HttpParams()
      .set('query', query);

    return this.http.get(this.apiBaseUrl + 'users/search', { params });
  }
}
