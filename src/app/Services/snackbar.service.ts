import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColor } from '../ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../Utils/ResponseCode.enum';
import { isNullOrUndefined } from 'util';

export class SnackbarService {
    snackbar: MatSnackBar;

    setSnackbar(snackbar: MatSnackBar) {
        this.snackbar = snackbar;
    }

    openSnackBar(options: SnackbarOptions) {
        var colorClass = 'snackbar-' + options.backgroundColor.toString()
        this.snackbar.open(options.message, options.action,
            {
                duration: options.duration,
                verticalPosition: "top",
                horizontalPosition: "right",
                panelClass: ['snackbar', colorClass]
            });
    }

    showSuccessMessage() {
        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Success,
            message: "Success!",
            action: "Close",
            duration: 1000
        }));
    }

    showErrorMessage(errorResponse: HttpErrorResponse = null, message: string = 'Error. Something went wrong') {
        if (!isNullOrUndefined(errorResponse) &&
            errorResponse.error.error.code == ResponseCode.ValidationFailed &&
            isNullOrUndefined(message)) 
        {
            message = 'Incorrect data';
        }

        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: "Close",
            duration: 1000
        }));
    }
}