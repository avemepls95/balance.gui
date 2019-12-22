import { SnackbarOptions } from '../ControlLayer/SnackbarOptions';
import { MatSnackBar } from '@angular/material/snack-bar';

export class SnackbarService {

    openSnackBar(snackbar: MatSnackBar, options: SnackbarOptions) {
        var colorClass = 'snackbar-' + options.backgroundColor.toString()
        snackbar.open(options.message, options.action,
            {
                duration: options.duration,
                verticalPosition: "top",
                horizontalPosition: "right",
                panelClass: ['snackbar', colorClass]
            });
    }
}