import { SnackBarColor } from './SnackBarColor.enum';

export class SnackbarOptions {
    backgroundColor: SnackBarColor = SnackBarColor.Default;
    message: string = "";
    action: string = "";
    duration: number = 800;

    public constructor(
        fields?: {
            backgroundColor?: SnackBarColor;
            message?: string;
            action?: string;
            duration?: number;
        }) {
        if (fields) Object.assign(this, fields);
    }
}
