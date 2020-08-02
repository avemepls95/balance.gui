import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUpdateTicketDto } from '../Model/Tickets/Dto/CreateUpdate/CreateUpdateTicketDto';
import { UUID } from 'angular2-uuid';
import { TicketsResponse } from '../Model/Tickets/Dto/TicketsResponse';

@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.ticketsApiUrl;
  }

  getUsersSuggestion(query: string): Observable<any> {
    if (query == "" || query == undefined)
      return EMPTY;

    const params = new HttpParams()
      .set('query', query);

    return this.http.get('http://localhost:8081/' + 'users/search', { params });
  }

  getTicketById(id: UUID): Observable<TicketsResponse> {
    if (!id)
      throw Error("Cannot get a ticket. Passed parameter is null or undefined.");

    return this.http.get(this.apiBaseUrl + 'ticket/' + id.toString()) as Observable<TicketsResponse>;
  }

  createTicket(ticket: CreateUpdateTicketDto): Observable<any> {
    if (!ticket)
      throw Error("Cannot create a ticket. Passed parameter is null or undefined.");

    return this.http.post(
      this.apiBaseUrl + 'ticket',
      ticket
    );
  }
}
