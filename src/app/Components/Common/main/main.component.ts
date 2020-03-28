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
import { CookieService } from 'ngx-cookie-service';
import { isNullOrUndefined } from 'util';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = 'Balance';
  userFirstName: string;
  avatarUrl: string;
  languagesIcons = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    snackbar: MatSnackBar,
    public translateHelper: TranslateHelper,
  ) { 
    snackbarService.setSnackbar(snackbar);

    this.languagesIcons[TranslateHelper.ruKey] = 'flag-icon-ru';
    this.languagesIcons[TranslateHelper.enKey] = 'flag-icon-gb';

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
        .subscribe(() => { this.snackbarService.showSuccessMessage(); });
    });
  }

  getCurrentLanguageIconClass() : string {
    let language = this.translateHelper.getCurrentLanguage();
    return this.languagesIcons[language];
  }

  refreshPage() {
    window.location.reload();
  }

  switchLanguage() {
    let language = this.translateHelper.getCurrentLanguage() == TranslateHelper.ruKey ?
      TranslateHelper.enKey : TranslateHelper.ruKey;
    this.translateHelper.switchToLanguage(language);
  }

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
