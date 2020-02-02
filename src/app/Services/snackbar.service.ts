import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColor } from '../ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../Utils/ResponseCode.enum';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    snackbar: MatSnackBar;

    constructor(private translateService: TranslateService) {

    }

    setSnackbar(snackbar: MatSnackBar) {
        this.snackbar = snackbar;
    }

    openSnackBar(options: SnackbarOptions) {
        var colorClass = 'snackbar-' + options.backgroundColor.toString();
        if (options.action == '')
            options.action = this.translateService.instant('common.close');

        this.snackbar.open(options.message, options.action,
            {
                duration: options.duration,
                verticalPosition: "top",
                horizontalPosition: "right",
                panelClass: ['snackbar', colorClass]
            });
    }

    showSuccessMessage() {
        let successText = this.translateService.instant('common.success') + '!';
        let closeText = this.translateService.instant('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Success,
            message: successText,
            action: closeText,
            duration: 2000
        }));
    }

    showErrorMessage(
        errorResponse: HttpErrorResponse = null,
        message: string = this.translateService.instant('common.somethingWentWrong')
    ) {
        if (!isNullOrUndefined(errorResponse) &&
            errorResponse.error.error.code == ResponseCode.ValidationFailed &&
            isNullOrUndefined(message)) {
            message = this.translateService.instant('common.incorrectData');
        }

        let closeText = this.translateService.instant('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }
}