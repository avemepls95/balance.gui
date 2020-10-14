import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { EMPTY } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { User } from 'src/app/Model/User';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'search-user-control',
  templateUrl: './search-user-control.component.html'
})
export class SearchUserControlComponent implements OnInit {
  searchUserCtrl = new FormControl();
  filteredUsers: User[];
  isLoading = false;
  errorMsg: string;

  userAlreadyIsSelected: boolean = false;

  searchResultEmptyMessage: string = "Нет совпадений";

  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;

  @Output() userSelected = new EventEmitter<any>();
  @Input() value: string;

  constructor(
    private balanceApiService: BalanceApiService,
  ) {

  }

  ngOnInit() {
    this.searchUserCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          if (this.userAlreadyIsSelected) {
            this.userAlreadyIsSelected = false;
            this.isLoading = false;
            return EMPTY;
          }

          return this.balanceApiService.getUsersSuggestion(value)
            .pipe(finalize(() => { this.isLoading = false }));
        })
      )
      .subscribe(data => {
        if (isNullOrUndefined(data['data'])) {
          this.errorMsg = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          this.filteredUsers = data['data'];
          if (this.filteredUsers.length == 0)
            this.errorMsg = this.searchResultEmptyMessage;
        }
      });
  }

  setValue(userName: string) {
    this.userInput.nativeElement.value = userName;
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.userAlreadyIsSelected = true;

    const user = this.filteredUsers.filter(u => u.id == +event.option.value.id)[0];
    this.userSelected.emit(user)
  }

  displayFn(user: User) {
    return user ? user.username : user;
  }
}