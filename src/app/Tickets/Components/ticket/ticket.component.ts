import { ExecutionResultDeclinedDialogComponent } from './../execution-result-declined-dialog/execution-result-declined-dialog.component';
import { ExecutionUnit } from './../../Model/ExecutionUnit';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
import { MatDialog } from '@angular/material';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/Common/Components/confirm-dialog/confirm-dialog.component';
import { EXECUTION_UNIT_RESULT } from '../../Model/ExecutionUnitResult';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit, OnDestroy {
  titleFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  mode = 'creating';
  ticket: Ticket;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('usersInput', { static: false }) usersInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('chipList', { static: false }) chipList;

  searchUserFromControl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;
  searchResultEmptyMessage = 'Нет совпадений';

  todayDate: Date = new Date();

  TICKET_STATUS = TICKET_STATUS;
  ticketStatusLabel = TicketStatusLabel;
  statusBadgeClassName: string;
  EXECUTION_UNIT_RESULT = EXECUTION_UNIT_RESULT;

  constructor(
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private snackbar: MatSnackBar,
    private ticketsApiService: TicketsApiService,
    private router: Router,
    activateRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    snackbarService.setSnackbar(snackbar);

    const state = this.router.getCurrentNavigation().extras.state;
    if (!isNullOrUndefined(state)) {
      this.mode = 'editing';
      this.ticket = state.ticket;
    } else {
      this.ticket = new Ticket();
    }

    if (!isNullOrUndefined(state)) return;

    activateRoute.params.subscribe((params) => {
      const id = params['id'];
      if (!isNullOrUndefined(id)) {
        if (UUIDValidator.isValidUUID(id)) {
          this.mode = 'editing';
          loaderService.show();
          ticketsApiService
            .getTicketById(id)
            .pipe(finalize(() => { this.loaderService.hide(); }))
            .subscribe((result) => {
              this.ticket = TicketGetDtoMapper.convertDtoToTicket(result.data);
              loaderService.hide();
            });
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
        switchMap((value) =>
          this.ticketsApiService.getUsersByTerm(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        if (!data['data']) {
          this.errorMsg = 'Internal Error. We\'re Sorry :(';
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');

          return;
        }

        if (data['data'].length == 0)
          this.errorMsg = this.searchResultEmptyMessage;

        this.filteredUsers = this.removeSelectedUsersFromSuggestion(
          data['data']
        );
        this.chipList.errorState = false;
      });
  }

  ngOnDestroy() {
    this.snackbar.ngOnDestroy();
  }

  removeSelectedUsersFromSuggestion(suggestionUsers: User[]): User[] {
    this.ticket.executionUnits.forEach((selectedUnit) => {
      const index = suggestionUsers.findIndex(
        (u) => u.id === selectedUnit.assignee.id
      );
      if (index >= 0) {
        suggestionUsers.splice(index, 1);
      }
    });

    return suggestionUsers;
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    const user = this.filteredUsers.filter(
      (u) => u.id === +event.option.value
    )[0];
    if (!this.ticket.executionUnits)
      this.ticket.executionUnits = new Array<ExecutionUnit>();

    this.ticket.executionUnits.push(new ExecutionUnit({ assignee: user }));

    this.usersInput.nativeElement.value = '';
    this.searchUserFromControl.setValue('');
    this.filteredUsers = [];
  }

  removeExecutionUnit(unit: ExecutionUnit): void {
    const index = this.ticket.executionUnits.findIndex(
      (u) => u.assignee.id === unit.assignee.id
    );

    if (index >= 0)
      this.ticket.executionUnits.splice(index, 1);

    if (this.ticket.executionUnits.length < 1)
      this.chipList.errorState = true;
  }

  canEdit(): boolean {
    if (!this.ticket.statusKey) return true;

    return this.ticket.canEdit;
  }

  createTicket(): void {
    if (!this.ticket.title || this.ticket.title === '') {
      this.titleFormControl.markAsTouched();
      return;
    }

    if (!this.ticket.executionUnits ||
      this.ticket.executionUnits.length === 0
    ) {
      this.chipList.errorState = true;
      return;
    }

    const ticketDto = TicketCreateUpdateDtoMapper.convertTicketToDto(
      this.ticket
    );
    this.loaderService.show();
    this.ticketsApiService
      .createTicket(ticketDto)
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
      )
      .subscribe((response: TicketsResponse) => {
        this.loaderService.show();
        this.ticketsApiService
          .getTicketById(response.data)
          .pipe(
            finalize(() => {
              this.loaderService.hide();
            })
          )
          .subscribe((response: TicketsResponse) => {
            const ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

            this.router.navigateByUrl('/editTicket/' + response.data.id, {
              state: { ticket },
            });
            this.snackbarService.showSuccessMessage();
          });
      });
  }

  updateTicket(): void {
    const checkDto = TicketCreateUpdateDtoMapper.convertTicketToDto(
      this.ticket
    );
    this.loaderService.show();
    this.ticketsApiService
      .updateTicket(checkDto)
      .pipe(finalize(() => { this.loaderService.hide(); }))
      .subscribe(() => { this.loadTicketAfterAction(); });
  }

  moveToStatus(targetStatus: TICKET_STATUS): void {
    this.loaderService.show();
    this.ticketsApiService
      .moveToStatus(this.ticket.id, this.ticket.modifiedDate, targetStatus)
      .pipe(finalize(() => { this.loaderService.hide(); }))
      .subscribe(() => { this.loadTicketAfterAction(); });
  }

  getStatusBadgeClassName(): string {
    return `${this.ticket.statusKey.toLowerCase()}-status`;
  }

  complete(): void {
    const message =
      this.ticket.executionUnits.length === 1
        ? 'Уверены, что хотите закрыть задачу?'
        : 'Уверены, что хотите закрыть свою часть задачи?';
    const dialogData = new ConfirmDialogModel('Подтверждение', message);

    this.dialog
      .open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: dialogData,
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (!dialogResult) return;

        this.loaderService.show();
        this.ticketsApiService
          .applyExecutionUnitResult(this.ticket.id, EXECUTION_UNIT_RESULT.Completed, this.ticket.modifiedDate)
          .pipe(finalize(() => { this.loaderService.hide(); }))
          .subscribe(() => { this.loadTicketAfterAction(); });
      });
  }

  decline(): void {
    const dialogRef = this.dialog.open(ExecutionResultDeclinedDialogComponent, { });

    dialogRef.afterClosed().subscribe(comment => {
      if (!comment)
        throw new Error("Comment must not be empty.");

      this.loaderService.show();
      this.ticketsApiService
        .applyExecutionUnitResult(this.ticket.id, EXECUTION_UNIT_RESULT.Declined, this.ticket.modifiedDate)
        .pipe(finalize(() => { this.loaderService.hide(); }))
        .subscribe(() => { this.snackbarService.showSuccessMessage(); });
    });
  }

  loadTicketAfterAction() {
    this.loaderService.show();
    this.ticketsApiService
      .getTicketById(this.ticket.id)
      .pipe(finalize(() => { this.loaderService.hide(); }))
      .subscribe((response: TicketsResponse) => {
        this.ticket = TicketGetDtoMapper.convertDtoToTicket(response.data);

        this.snackbarService.showSuccessMessage();
      });
  }
}
