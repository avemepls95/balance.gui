import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { User } from 'src/app/Model/User';

@Component({
  selector: 'app-position-card',
  templateUrl: './position-card.component.html',
  styleUrls: ['./position-card.component.css']
})
export class PositionCardComponent implements OnInit {

  action: string;
  obj: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('usersInput', { static: false }) usersInput: ElementRef<HTMLInputElement>;

  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<PositionCardComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private balanceApiService: BalanceApiService) 
  {
    this.obj = data.obj;
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
          this.filteredUsers = data['data'];
        }
      });
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.obj });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  removeUser(user: User): void {
    debugger
    const index = this.obj.users.findIndex(u => u.id == +user.id);

    if (index >= 0) {
      this.obj.users.splice(index, 1);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    let user = this.filteredUsers.filter(u => u.id == +event.option.value)[0];
    if (this.obj.users == null)
      this.obj.users = new Array<Position>();

    this.obj.users.push(user);
    this.usersInput.nativeElement.value = '';
    this.searchUserCtrl.setValue('');
  }

  amountMask(rawValue: string): RegExp[] {
    const mask = /\d/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];

    for (let i = 0; i < strLength; i++) {
      nameMask.push(mask);
    }

    return nameMask;
  }

  canCreate() {
    return this.obj.title != null &&
      this.obj.title != '' &&
      this.obj.amount != null &&
      this.obj.amount != '' &&
      this.obj.users != null &&
      this.obj.users.length != 0;
  }
}
