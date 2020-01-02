import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarColor } from '../ControlLayer/SnackBarColor.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../Utils/ResponseCode.enum';

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
            duration: 0
        }));
    }

    showErrorMessage(errorResponse: HttpErrorResponse) {
        let message = "Error. Something went wrong";
        if (errorResponse.error.error.code == ResponseCode.ValidationFailed)
            message = 'Incorrect data';

        this.openSnackBar(new SnackbarOptions({
            backgroundColor: SnackBarColor.Error,
            message: message,
            action: "Close",
            duration: 0
        }));
    }
}