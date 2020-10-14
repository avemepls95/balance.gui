import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColor } from '../ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../Utils/ResponseCode.enum';
import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    snackbar: MatSnackBar;

    constructor() {
    }

    setSnackbar(snackbar: MatSnackBar) {
        this.snackbar = snackbar;
    }

    private openSnackBar(options: SnackbarOptions) {
        var colorClass = 'snackbar-' + options.backgroundColor.toString();
        if (options.action == '')
            options.action = 'Закрыть';

        this.snackbar.open(
            options.message,
            options.action, 
            {
                duration: 0,//options.duration,
                verticalPosition: "top",
                horizontalPosition: "right",
                panelClass: ['snackbar', colorClass]
            }
        );
    }

    showSuccessMessage() {
        let successText = 'Успех!';
        let closeText = 'Закрыть';
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Success,
            message: successText,
            action: closeText,
            duration: 2000
        }));
    }

    showErrorMessage(
        errorResponse: HttpErrorResponse = null,
        message: string = 'Упс! Что-то пошло не так'
    ) {
        if (!isNullOrUndefined(errorResponse) &&
            errorResponse.error.error.code == ResponseCode.ValidationFailed) {
            message = 'Ошибка валидации';
        }

        let closeText = 'Закрыть';
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }

    showInformationMessage(message: string): void {
        let closeText = 'Закрыть';
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Information,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }

    showMessage(message: string): void {
        let closeText = 'Закрыть';
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Default,
            message: message,
            action: closeText,
            duration: 2000
        }));
    }
}