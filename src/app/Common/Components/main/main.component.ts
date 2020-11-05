import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Common/Services/auth.service';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotificationsInfoComponent } from '../notifications-info/notifications-info.component';
import { RoutePathsManager } from 'src/app/RoutePathsManager';
import { TransferCardComponent } from 'src/app/Balance/Components/transfer-card/transfer-card.component';
import { TransferDto } from 'src/app/Balance/Contracts/TransferDto';
import { ThemeService } from '../../Services/theme.service';
import { BalanceApiService } from '../../../Balance/Services/balance-api.service';
import { LoaderService } from '../../Services/loader.service';
import { SnackbarService } from '../../Services/snackbar.service';

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

  selectedSystem: any = 'balance';

  constructor(
    private router: Router,
    private authService: AuthService,
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    snackbar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private themeService: ThemeService
  ) {
    snackbarService.setSnackbar(snackbar);

    if (RoutePathsManager.isTicketsRoute(this.router.url)) {
      this.selectedSystem = 'tickets';
      this.themeService.setTicketsTheme(true);
    }

    this.userFirstName = localStorage.getItem(LocalStorageManager.userFirstNameKey);
    let avatarTmp = localStorage.getItem(LocalStorageManager.userPhotoUrlKey);
    this.avatarUrl = !isNullOrUndefined(avatarTmp) ? avatarTmp : 'assets/images/empty-avatar.png';
  }

  ngOnInit() {
  }

  openTransferCard(): void {
    const dialogRef = this.dialog.open(TransferCardComponent, { });

    dialogRef.afterClosed().subscribe(data => {
      if (isNaN(data.amount))
        return;

      let transferDto = new TransferDto({
        id: UUID.UUID(),
        amount: data.amount,
        recipientId: data.user.id,
        description: data.description
      });

      this.loaderService.show();
      this.balanceApiService.registerTransfer(transferDto)
        .pipe(finalize(() => {
          this.loaderService.hide();
        }))
        .subscribe(() => { this.snackbarService.showSuccessMessage(); });
    });
  }

  openNotificationsInfo(): void {
    this._bottomSheet.open(NotificationsInfoComponent);
  }

  refreshPage(): void {
    window.location.reload();
  }

  logout(): void {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }

  onSystemChanged(newSystemKey: string): void {
    if (newSystemKey == 'tickets') {
      this.themeService.setTicketsTheme(true);
      this.router.navigate(['/tickets']);
      return;
    }

    this.themeService.setTicketsTheme(false);
    this.router.navigate(['/debts']);
  }
}
