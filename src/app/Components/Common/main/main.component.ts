import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { TransferCardComponent } from '../../Domain/transfer-card/transfer-card.component';
import { TransferDto } from 'src/app/Model/Dto/TransferDto';
import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Services/loader.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = 'Balance';
  userFirstName: string;
  avatarUrl: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    public translateService: TranslateService,
    private cookieService: CookieService
  ) { 
    this.userFirstName = localStorage.getItem(LocalStorageManager.userFirstNameKey);
    let avatarTmp = localStorage.getItem(LocalStorageManager.userPhotoUrlKey);
    this.avatarUrl = !isNullOrUndefined(avatarTmp) ? avatarTmp : 'assets/images/empty-avatar.png';
  }

  ngOnInit() {
  }

  openTransferCard() {
    const dialogRef = this.dialog.open(TransferCardComponent, { });

    dialogRef.afterClosed().subscribe(data => {
      if (isNaN(data.amount))
        return;

      let transferDto = new TransferDto({
        id: UUID.UUID(),
        amount: data.amount,
        recipientId: data.user.id
      });

      this.loaderService.show();
      this.balanceApiService.registerTransfer(transferDto)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(
          (response: BalanceResponse) => {
            this.snackbarService.showSuccessMessage();
          },
          (errorResponse: HttpErrorResponse) => {
            this.snackbarService.showErrorMessage(errorResponse);
          }
        );

    });
  }

  refreshPage() {
    window.location.reload();
  }

  switchLanguage() {
    let language = this.translateService.currentLang == 'ru' ? 'en' : 'ru';
    this.translateService.use(language);
    this.cookieService.set('language', language);
  }

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
