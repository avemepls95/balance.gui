import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/Utils/MyErrorStateMatcher';
import { LoaderService } from 'src/app/Services/loader.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { isNullOrUndefined } from 'util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/app/Model/Tickets/ticket';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { User } from 'src/app/Model/User';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { TicketsApiService as TicketsApiService } from 'src/app/Services/tickets-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TicketCreateUpdateDtoMapper } from 'src/app/Model/Tickets/Converters/TicketCreateUpdateDtoMapper';
import { TicketsResponse } from 'src/app/Model/Tickets/Dto/TicketsResponse';
import { TicketGetDtoMapper } from 'src/app/Model/Tickets/Converters/TicketGetDtoMapper';
import { UUIDValidator } from 'src/app/Utils/UUIDValidator';
import { GetTicketDto } from 'src/app/Model/Tickets/Dto/Get/GetTicketDto';

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
  searchResultEmptyMessage: string;

  todayDate: Date = new Date();

  constructor(
    private loaderService: LoaderService
    , private snackbarService: SnackbarService
    , private translateHelper: TranslateHelper
    , private snackbar: MatSnackBar
    , private ticketsApiService: TicketsApiService
    , private router: Router
    , activateRoute: ActivatedRoute
  ) {
    snackbarService.setSnackbar(snackbar);

    let state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.mode = 'editing';

      this.ticket = state.ticket;
    }
    else {
      this.ticket = new Ticket();
    }

    this.searchResultEmptyMessage = this.translateHelper.getValue('check.searchResultsEmpty');

    if (!isNullOrUndefined(state))
      return;

    activateRoute.params.subscribe(params => {
      var id = params['id'];
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
                let ticketDto = result.data as GetTicketDto;
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
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.ticketsApiService.getUsersByTerm(value)
          .pipe(finalize(() => { this.isLoading = false }),
        )
        )
      )
      .subscribe(data => {
        if (!data['data']) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');

          return;
        }

        if (data['data'].length == 0)
          this.errorMsg = this.searchResultEmptyMessage;
        this.filteredUsers = this.removeSelectedUsersFromSuggestion(data['data']);
        this.chipList.errorState = false;
      });
  }

  ngOnDestroy() {
    this.snackbar.ngOnDestroy();
  }

  removeSelectedUsersFromSuggestion(suggestion: User[]): User[] {
    this.ticket.assignees.forEach(selectedUser => {
      const index = suggestion.findIndex(u => u.id == selectedUser.id);
      if (index >= 0) {
        suggestion.splice(index, 1);
      }
    });

    return suggestion;
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let user = this.filteredUsers.filter(u => u.id == +event.option.value)[0];
    if (!this.ticket.assignees)
      this.ticket.assignees = new Array<User>();

    this.ticket.assignees.push(user);

    this.usersInput.nativeElement.value = '';
    this.searchUserFromControl.setValue('');
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
    if (!this.ticket.status)
      return true;
    return true;
    // let result = this.check.state == CHECK_STATE.EDITING && this.hasEditPermissions;
    // return result;
  }

  createTicket(): void {
    if (!this.ticket.title || this.ticket.title == '') {
      this.titleFormControl.markAsTouched();
      return;
    }

    if (!this.ticket.assignees || this.ticket.assignees.length == 0) {
      this.chipList.errorState = true;
      return;
    }

    let ticketDto = TicketCreateUpdateDtoMapper.convertTicketToDto(this.ticket);
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
                let ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

                this.router.navigateByUrl('/editTicket/' + response.data.id, { state: { ticket } });
                this.snackbarService.showSuccessMessage();
              }
            );
        }
      );
  }

  updateTicket(): void {
    let checkDto = TicketCreateUpdateDtoMapper.convertTicketToDto(this.ticket);
    this.loaderService.show();
    this.ticketsApiService.updateTicket(checkDto)
      .pipe(finalize(() => {
        this.loaderService.hide();
      }))
      .subscribe(
        (response: TicketsResponse) => {
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
}
