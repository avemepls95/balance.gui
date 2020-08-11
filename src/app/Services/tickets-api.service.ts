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

  getUsersByTerm(term: string): Observable<TicketsResponse> {
    if (term == "" || !term)
      throw new Error("Cannot get users. Passed parameter is null, undefined or empty.");

    return this.http.get(this.apiBaseUrl + 'user/search/' + term) as Observable<TicketsResponse>;
  }

  getTicketById(id: UUID): Observable<TicketsResponse> {
    if (!id)
      throw Error("Cannot get ticket. Passed parameter is null or undefined.");

    return this.http.get(this.apiBaseUrl + 'ticket/' + id.toString()) as Observable<TicketsResponse>;
  }

  createTicket(ticket: CreateUpdateTicketDto): Observable<TicketsResponse> {
    if (!ticket)
      throw Error("Cannot create ticket. Passed parameter is null or undefined.");

    return this.http.post(
      this.apiBaseUrl + 'ticket',
      ticket
    ) as Observable<TicketsResponse>;
  }

  updateTicket(ticket: CreateUpdateTicketDto): Observable<TicketsResponse> {
    if (!ticket)
      throw Error("Cannot update ticket. Passed parameter is null or undefined.");

    return this.http.put(
      this.apiBaseUrl + 'ticket/' + ticket.id.toString(),
      ticket
    ) as Observable<TicketsResponse>;
  }
}
