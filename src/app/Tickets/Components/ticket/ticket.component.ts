import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/app/Tickets/Model/Ticket';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { User } from 'src/app/Common/Model/User';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TicketCreateUpdateDtoMapper } from 'src/app/Tickets/Converters/TicketCreateUpdateDtoMapper';
import { LoaderService } from 'src/app/Common/Services/loader.service';
import { SnackbarService } from 'src/app/Common/Services/snackbar.service';
import { TicketsApiService } from 'src/app/Tickets/Services/tickets-api.service';
import { MyErrorStateMatcher } from 'src/app/Common/Utils/MyErrorStateMatcher';
import { UUIDValidator } from 'src/app/Common/Utils/UUIDValidator';
import { GetTicketDto } from '../../Contracts/Get/GetTicketDto';
import { TicketsResponse } from '../../Contracts/TicketsResponse';
import { TicketGetDtoMapper } from '../../Converters/TicketGetDtoMapper';
import { TicketStatusLabel, TICKET_STATUS } from '../../Model/TicketStatus';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, OnDestroy {
  titleFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  mode: string = 'creating';
  ticket: Ticket;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('usersInput', { static: false }) usersInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', { static: false }) chipList;

  searchUserFromControl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;
  searchResultEmptyMessage: string = 'Нет совпадений';

  todayDate: Date = new Date();

  TICKET_STATUS = TICKET_STATUS;
  ticketStatusLabel = TicketStatusLabel;
  statusBadgeClassName: string;

  constructor(
    private loaderService: LoaderService
    , private snackbarService: SnackbarService
    , private snackbar: MatSnackBar
    , private ticketsApiService: TicketsApiService
    , private router: Router
    , activateRoute: ActivatedRoute
  ) {
    snackbarService.setSnackbar(snackbar);

    const state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.mode = 'editing';
      this.ticket = state.ticket;
    }
    else {
      this.ticket = new Ticket();
    }

    if (!isNullOrUndefined(state))
      return;

    activateRoute.params.subscribe(params => {
      const id = params['id'];
      if (!isNullOrUndefined(id)) {
        if (UUIDValidator.isValidUUID(id)) {
          this.mode = 'editing';
          loaderService.show();
          ticketsApiService.getTicketById(id)
            .pipe(finalize(() => {
              this.loaderService.hide();
            }))
            .subscribe(
              result => {
                const ticketDto = result.data as GetTicketDto;
                this.ticket = TicketGetDtoMapper.convertDtoToTicket(ticketDto);
                this.ticket.assignees = new Array<User>();

                ticketDto.assignees.forEach(user => {
                  this.ticket.assignees.push(new User({
                    id: user.id,
                    username: user.username
                  }));
                });
                loaderService.hide();
              }
            );
        } else {
          // TODO: handle incorrect id
        }
      }
    });
  }

  ngOnInit() {
    this.searchUserFromControl.valueChanges
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.ticketsApiService.getUsersByTerm(value)
          .pipe(finalize(() => { this.isLoading = false; }))
        )
      )
      .subscribe(data => {
        if (!data['data']) {
          this.errorMsg = 'Internal Error. We\'re Sorry :(';
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');

          return;
        }

        if (data['data'].length == 0)
          this.errorMsg = this.searchResultEmptyMessage;
        this.filteredUsers = this.removeSelectedUsersFromSuggestion(data['data']);
        this.chipList.errorState = false;
        // if (data['data'] == undefined) {
        //   this.errorMsg = "Internal Error. We're Sorry :(";
        //   this.filteredUsers = [];
        //   console.log('Internal Error. Users data is null');
        // } else {
        //   if (data['data'].length == 0)
        //     this.errorMsg = this.searchResultEmptyMessage;
        //   this.filteredUsers = this.removeSelectedUsersFromSuggestion(data['data']);
        // }
      });
  }

  ngOnDestroy() {
    this.snackbar.ngOnDestroy();
  }

  removeSelectedUsersFromSuggestion(suggestion: User[]): User[] {
    this.ticket.assignees.forEach(selectedUser => {
      const index = suggestion.findIndex(u => u.id === selectedUser.id);
      if (index >= 0) {
        suggestion.splice(index, 1);
      }
    });

    return suggestion;
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    const user = this.filteredUsers.filter(u => u.id === +event.option.value)[0];
    if (!this.ticket.assignees)
      this.ticket.assignees = new Array<User>();

    this.ticket.assignees.push(user);

    this.usersInput.nativeElement.value = '';
    this.searchUserFromControl.setValue('');
    this.filteredUsers = [];
  }

  removeAssignee(user: User): void {
    // if (this.action == 'View')
    //   return;

    const index = this.ticket.assignees.findIndex(u => u.id == user.id);

    if (index >= 0) {
      this.ticket.assignees.splice(index, 1);
    }

    if (this.ticket.assignees.length < 1) {
      this.chipList.errorState = true;
    }
  }

  canEdit(): boolean {
    if (!this.ticket.statusKey)
      return true;

    return this.ticket.canEdit;
  }

  createTicket(): void {
    if (!this.ticket.title || this.ticket.title === '') {
      this.titleFormControl.markAsTouched();
      return;
    }

    if (!this.ticket.assignees || this.ticket.assignees.length === 0) {
      this.chipList.errorState = true;
      return;
    }

    const ticketDto = TicketCreateUpdateDtoMapper.convertTicketToDto(this.ticket);
    this.loaderService.show();
    this.ticketsApiService.createTicket(ticketDto)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: TicketsResponse) => {
          this.loaderService.show();
          this.ticketsApiService.getTicketById(response.data)
            .pipe(finalize(() => {
              this.loaderService.hide();
            }))
            .subscribe(
              (response: TicketsResponse) => {
                const ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

                this.router.navigateByUrl('/editTicket/' + response.data.id, { state: { ticket } });
                this.snackbarService.showSuccessMessage();
              }
            );
        }
      );
  }

  updateTicket(): void {
    const checkDto = TicketCreateUpdateDtoMapper.convertTicketToDto(this.ticket);
    this.loaderService.show();
    this.ticketsApiService.updateTicket(checkDto)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(() => {
          this.loaderService.show();
          this.ticketsApiService.getTicketById(this.ticket.id)
            .pipe(finalize(() => {
              this.loaderService.hide();
            }))
            .subscribe(
              (response: TicketsResponse) => {
                this.ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

                this.snackbarService.showSuccessMessage();
              }
            );
        }
      );
  }

  moveToStatus(targetStatus: TICKET_STATUS): void {
    this.loaderService.show();
    this.ticketsApiService.moveToStatus(this.ticket.id, targetStatus)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(() => {
          this.loaderService.show();
          this.ticketsApiService.getTicketById(this.ticket.id)
            .pipe(finalize(() => { this.loaderService.hide(); }))
            .subscribe(
              (response: TicketsResponse) => {
                this.ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

                this.snackbarService.showSuccessMessage();
              }
            );
        }
      );
  }

  getStatusBadgeClassName() {
    return `${this.ticket.statusKey.toLowerCase()}-status`;
  }
}
