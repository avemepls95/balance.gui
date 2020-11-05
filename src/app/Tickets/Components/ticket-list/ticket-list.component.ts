import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BalanceResponse } from 'src/app/Balance/Model/BalanceResponse';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/Common/Components/confirm-dialog/confirm-dialog.component';
import { TableUtils } from 'src/app/Common/ControlLayer/Utils/TableUtils';
import { LoaderService } from 'src/app/Common/Services/loader.service';
import { SnackbarService } from 'src/app/Common/Services/snackbar.service';
import { Ticket } from '../../Model/Ticket';
import { TicketsApiService } from '../../Services/tickets-api.service';
import { TicketGetDtoMapper } from '../../Converters/TicketGetDtoMapper';
import { ListViewVariant } from '../../ViewModel/ListViewVariant';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})
export class TicketListComponent implements OnInit {

  tickets: Ticket[];

  displayedColumns: string[] = ['createdAt', 'title', 'actions'];

  itemsPerPage: number = 5;
  noMoreItems = false;

  // CHECK_STATE = CHECK_STATE;

  listViewVariants = ListViewVariant;
  selectedViewVariant = 'All';

  constructor(
    private ticketsApiService: TicketsApiService,
    private loaderService: LoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    snackbar: MatSnackBar)
  {
    snackbarService.setSnackbar(snackbar);

    loaderService.show();
    
    ticketsApiService.getTickets(this.selectedViewVariant, 0, this.itemsPerPage).pipe(
      finalize(() => loaderService.hide())
    ).subscribe(
      (response) => {
        this.tickets = response.data.map(c => TicketGetDtoMapper.convertDtoToTicketListModel(c));
        if (response.data.length == 0 || response.data.length % this.itemsPerPage != 0) {
          this.noMoreItems = true;
          return;
        }

        this.updateColumns();
      },
      (error) => console.error(error)
    );
  }

  ngOnInit() {
  }

  selectedViewVariantChange(): void {
    this.ticketsApiService.getTickets(this.selectedViewVariant, 0, this.itemsPerPage).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe(
      (response) => {
        this.tickets = response.data.map(c => TicketGetDtoMapper.convertDtoToTicketListModel(c));
        if (response.data.length == 0 || response.data.length % this.itemsPerPage != 0) {
          this.noMoreItems = true;
          return;
        }

        this.updateColumns();
      },
      (error) => console.error(error)
    );
  }

  loadNextSet(): void {
    const skip = this.tickets.length;
    this.loaderService.show();
    this.ticketsApiService.getTickets(this.selectedViewVariant, skip, this.itemsPerPage).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe(
      (response: BalanceResponse) => {
        if (response.data.length == 0 || response.data.length % this.itemsPerPage != 0) {
          this.noMoreItems = true;
          return;
        }

        let checks = response.data.map(c => TicketGetDtoMapper.convertDtoToTicketListModel(c));

        this.tickets = this.tickets.concat(checks);
        this.updateColumns();
      },
      (error) => console.error(error)
    );
  }

  deleteTicket(id: number) {
    const index = this.tickets.findIndex(c => c.id === id);
    if (index == -1) {
      console.log("Invalid ticket id:" + id);
    }

    const dialogData = new ConfirmDialogModel('Подтверждение', 'Вы уверены, что хотите удалить Задачу?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult)
        return;

      this.loaderService.show();
      this.ticketsApiService.deleteTicket(id)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(
          (response: BalanceResponse) => {
            this.snackbarService.showSuccessMessage();
            var deleted = this.tickets.splice(index, 1)[0];
            // reinitialize for grid updating
            this.tickets = this.tickets.filter(c => !this.tickets.includes(deleted));

            this.updateColumns();
          }
        );
    });
  }

  checkActionsVisible(checkId: number): boolean {
    // let check = this.tickets.find(c => c.id == checkId);
    // if (isNullOrUndefined(check)) {
    //   throw Error(`Check with Id = ${checkId} not found.`)
    // }

    // let result =
    //   check.state != CHECK_STATE.PROCESSED &&
    //   !!check.roles &&
    //   check.roles.includes(UserCheckRoles.Owner)
    let result = true;

    return result;
  }

  updateColumns() {
    // let allChecksProcessed =
    //   this.tickets.filter(c => c.state == CHECK_STATE.PROCESSED).length == this.checks.length;

    // if (allChecksProcessed)
    //   TableUtils.setColumnVisible(this.displayedColumns, 'actions', false);

    // let unprocessedChecksWhereOwner = this.tickets.filter(c =>
    //   !!c.roles &&
    //   c.roles.includes(UserCheckRoles.Owner) &&
    //   c.state != CHECK_STATE.PROCESSED
    // );

    // let hasAccessForAnyUnprocessedCheckActions = unprocessedChecksWhereOwner.length != 0;
    let hasAccessForAnyUnprocessedCheckActions = true;
    TableUtils.setColumnVisible(this.displayedColumns, 'actions', hasAccessForAnyUnprocessedCheckActions);
  }
}
