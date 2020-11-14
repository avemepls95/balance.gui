import { TICKET_STATUS } from './../Model/TicketStatus';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UUID } from 'angular2-uuid';
import { CreateUpdateTicketDto } from '../Contracts/CreateUpdate/CreateUpdateTicketDto';
import { TicketsResponse } from '../Contracts/TicketsResponse';

@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.ticketsApiUrl;
  }

  getUsersByTerm(term: string): Observable<TicketsResponse> {
    if (!term)
      return EMPTY;

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

  deleteTicket(id: number): Observable<TicketsResponse> {
    return this.http.delete(this.apiBaseUrl + 'ticket/' + id.toString()) as Observable<TicketsResponse>;
  }

  getTickets(listViewVariant: string, skip: number, take: number): Observable<TicketsResponse> {
    const params = new HttpParams()
      .set('viewVariant', listViewVariant)
      .set('skip', skip.toString())
      .set('take', take.toString());

    return this.http.get(this.apiBaseUrl + 'ticket/list', { params }) as Observable<TicketsResponse>;
  }

  moveToStatus(ticketId: UUID, targetStatus: TICKET_STATUS): Observable<TicketsResponse> {
    if (!targetStatus)
      throw Error("Target status is null or undefined");

    const path = `ticket/${ticketId.toString()}/move-to-status/${targetStatus}`;
    return this.http.patch(this.apiBaseUrl + path, {}) as Observable<TicketsResponse>;
  }
}
