import { Component, OnInit, Optional, Inject, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionCardComponent } from '../position-card/position-card.component';
import { Consumption } from 'src/app/Model/Consumption';
import { User } from 'src/app/Model/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isNullOrUndefined, isNull } from 'util';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';

@Component({
  selector: 'app-consumptions',
  templateUrl: './consumptions-card.component.html',
  styleUrls: ['./consumptions-card.component.css']
})
export class ConsumptionsCardComponent implements OnInit, AfterContentInit {

  action: string;
  consumptions: Consumption[] = [];

  filteredUsers: User[];
  isLoading = false;
  errorMessages: Array<string>;

  userAlreadyIsSelected: boolean = false;

  myForm: FormGroup;

  searchResultEmptyMessage: string;

  constructor(
    public dialogRef: MatDialogRef<PositionCardComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private balanceApiService: BalanceApiService,
    private translateHelper: TranslateHelper
    ) 
  {
    this.consumptions = data.obj;
    this.action = data.action;
    this.searchResultEmptyMessage = this.translateHelper.getValue('check.searchResultsEmpty');

    this.myForm = new FormGroup({});
    this.errorMessages = new Array<string>(this.consumptions.length);
    for (let i = 0; i < this.consumptions.length; ++i) {
      let userControl = new FormControl();
      this.registerUserControlValueChanged(userControl, i);
      this.myForm.addControl("userControl" + i.toString(), userControl);
    }
  }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    if (isNullOrUndefined(this.consumptions)) {
      // this.payment.user = {} as User;
      return;
    }

    setTimeout(() => {
      for (let i = 0; i < this.consumptions.length; ++i) {
        let elem = <HTMLInputElement>document.getElementById("user-input-" + i.toString());
        elem.value = this.consumptions[i].user.username;
      }
    }, 0);
  }

  registerUserControlValueChanged(userControl, index: number) {
    userControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          debugger
          this.errorMessages[index] = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap((value: string) => {
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
        debugger
        if (isNullOrUndefined(data['data'])) {
          this.errorMessages[index] = "Internal Error. We're Sorry :(";
          this.filteredUsers = [];
          console.log('Internal Error. Users data is null');
        } else {
          if (data['data'].length == 0)
            this.errorMessages[index] = this.searchResultEmptyMessage + index.toString();
          this.filteredUsers = data['data'];
        }
      });
  }

  displayFn(user: User) {
    return user ? user.username : user;
  }

  selectedUser(event: MatAutocompleteSelectedEvent, consumption: Consumption): void {
    consumption.user = this.filteredUsers.filter(u => u.id == +event.option.value.id)[0];
    this.userAlreadyIsSelected = true;
  }
}
