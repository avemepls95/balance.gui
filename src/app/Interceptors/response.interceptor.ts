import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { SnackbarService } from '../Services/snackbar.service';
import { TranslateHelper } from '../Utils/TranslateHelper';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(
        public snackbarService: SnackbarService,
        private translateHelper: TranslateHelper
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            tap(evt => { }),
            catchError((err: any) => {
                if (!(err instanceof HttpErrorResponse))
                    return of(err);

                if (err.status === 403) {
                    let message = this.translateHelper.getValue('error.accessDenied');
                    this.snackbarService.showErrorMessage(null, message);
                    return of(err);
                }

                if (err.status == 404) {
                    if (err.error.error.code == 'check_not_found') {
                        let message: string = this.translateHelper.getValue('check.notFoundError') + '!';
                        this.snackbarService.showErrorMessage(null, message);
                        return of(err);
                    }
                }

                this.snackbarService.showErrorMessage(err);
                return of(err);
            }));

    }

}