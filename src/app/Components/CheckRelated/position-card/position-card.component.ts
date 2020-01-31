import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { User } from 'src/app/Model/User';
import { Position } from 'src/app/Model/Position';
import { ICanBeCreated } from 'src/app/Interfaces/ICanBeCreated';
import { ConsumptionsCardComponent } from '../consumptions/consumptions-card.component';
import { Consumption } from 'src/app/Model/Consumption';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.css']
})
export class PositionCardComponent implements OnInit, ICanBeCreated {

  action: string;
  position: Position;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  equalConsumptions: Boolean = true;

  @ViewChild('usersInput', { static: false }) usersInput: ElementRef<HTMLInputElement>;

  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<PositionCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private balanceApiService: BalanceApiService) {
    this.position = data.obj;
    this.action = data.action;
  }

  ngOnInit(): void {

    this.searchUserCtrl.valueChanges
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.balanceApiService.getUsersSuggestion(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data['data'] == undefined) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          if (data['data'].length == 0)
            this.errorMsg = "Search results are empty.";
          this.filteredUsers = this.removeSelectedUsersFromSuggestion(data['data']);
        }
      });
  }

  doAction() {
    if (this.equalConsumptions) {
      let part = Math.floor(this.position.amount / this.position.consumptions.length * 100) / 100;
      this.position.consumptions.forEach(consumption => {
        consumption.amount = part;
      });

      if (part * this.position.consumptions.length == this.position.amount) {
        this.dialogRef.close({ event: this.action, data: this.position });
        return;
      }

      let index = 0;
      while (this.position.consumptions.reduce((sum, current) => sum + current.amount, 0) != this.position.amount) {
        this.position.consumptions[index].amount += 0.01;
        if (index == this.position.consumptions.length - 1)
          index = 0;

        ++index;
      }
    }

    this.dialogRef.close({ event: this.action, data: this.position });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  removeConsumption(consumption: Consumption): void {
    if (this.action == 'View')
      return;

    const index = this.position.consumptions.findIndex(u => u.user.id == consumption.user.id);

    if (index >= 0) {
      this.position.consumptions.splice(index, 1);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let user = this.filteredUsers.filter(u => u.id == +event.option.value)[0];
    if (this.position.consumptions == null)
      this.position.consumptions = new Array<Consumption>();

    this.position.consumptions.push(new Consumption({ user: user }));
    this.usersInput.nativeElement.value = '';
    this.searchUserCtrl.setValue('');
  }

  removeSelectedUsersFromSuggestion(suggestion: User[]): User[] {
    if (this.position.consumptions == null || this.position.consumptions.length == 0)
      return suggestion;

    this.position.consumptions.map(c => c.user).forEach(selectedUser => {
      const index = suggestion.findIndex(u => u.id == selectedUser.id);
      if (index >= 0) {
        suggestion.splice(index, 1);
      }
    });

    return suggestion;
  }

  equalConsumptionsValueChanged(event) {
    if (!event.checked)
      this.openConsumptionCard(this.action, this.position.consumptions)
  }

  openConsumptionCard(action: string, consumptions: Consumption[]) {
    let data = {
      obj: consumptions.map(c => Object.assign({}, c)),
      action: action
    }

    const dialogRef = this.dialog.open(ConsumptionsCardComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  canBeCreated(): boolean {
    return this.position.title != null &&
      this.position.title != '' &&
      !isNaN(this.position.amount) &&
      this.position.consumptions != null &&
      this.position.consumptions.length != 0;
  }
}
