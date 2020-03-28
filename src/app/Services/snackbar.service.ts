import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColor } from '../ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../Utils/ResponseCode.enum';
import { isNullOrUndefined } from 'util';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    snackbar: MatSnackBar;

    constructor(private translateHelper: TranslateHelper) {

    }

    setSnackbar(snackbar: MatSnackBar) {
        this.snackbar = snackbar;
    }

    private openSnackBar(options: SnackbarOptions) {
        var colorClass = 'snackbar-' + options.backgroundColor.toString();
        if (options.action == '')
            options.action = this.translateHelper.getValue('common.close');

        this.snackbar.open(options.message, options.action,
            {
                duration: options.duration,
                verticalPosition: "top",
                horizontalPosition: "right",
                panelClass: ['snackbar', colorClass]
            });
    }

    showSuccessMessage() {
        let successText = this.translateHelper.getValue('common.success') + '!';
        let closeText = this.translateHelper.getValue('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Success,
            message: successText,
            action: closeText,
            duration: 2000
        }));
    }

    showErrorMessage(
        errorResponse: HttpErrorResponse = null,
        message: string = this.translateHelper.getValue('error.somethingWentWrong')
    ) {
        if (!isNullOrUndefined(errorResponse) &&
            errorResponse.error.error.code == ResponseCode.ValidationFailed) {
            message = this.translateHelper.getValue('error.incorrectData');
        }

        let closeText = this.translateHelper.getValue('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }

    showInformationMessage(message: string): void {
        let closeText = this.translateHelper.getValue('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Information,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }

    showMessage(message: string): void {
        let closeText = this.translateHelper.getValue('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Default,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }
}