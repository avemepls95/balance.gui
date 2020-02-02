import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { TransferCardComponent } from '../transfer-card/transfer-card.component';
import { TransferDto } from 'src/app/Model/Dto/TransferDto';
import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators';
import { BalanceResponse } from 'src/app/BalanceResponse';
import { SnackbarOptions } from 'src/app/ControlLayer/SnackbarOptions';
import { SnackBarColor } from 'src/app/ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from 'src/app/Utils/ResponseCode.enum';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Services/loader.service';
import { SnackbarService } from 'src/app/Services/snackbar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = 'Balance';
  userFirstName: string;
  avatar: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private balanceApiService: BalanceApiService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) { 
    this.userFirstName = localStorage.getItem(LocalStorageManager.userFirstNameKey);
    this.avatar = localStorage.getItem(LocalStorageManager.userPhotoUrlKey); 
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

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
