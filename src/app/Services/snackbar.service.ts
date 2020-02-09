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

    openSnackBar(options: SnackbarOptions) {
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
        message: string = this.translateHelper.getValue('common.somethingWentWrong')
    ) {
        if (!isNullOrUndefined(errorResponse) &&
            errorResponse.error.error.code == ResponseCode.ValidationFailed &&
            isNullOrUndefined(message)) {
            message = this.translateHelper.getValue('common.incorrectData');
        }

        let closeText = this.translateHelper.getValue('common.close');
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }
}