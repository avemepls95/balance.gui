import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { SnackbarService } from '../Services/snackbar.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(
        public snackbarService: SnackbarService,
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

                if (err.status === 401) {
                    this.snackbarService.showErrorMessage(null, 'Ошибка авторизации');
                    return of(err);
                }

                if (err.status === 403) {
                    this.snackbarService.showErrorMessage(null, 'Доступ запрещен');
                    return of(err);
                }

                if (err.status == 404) {
                    if (err.error.error.code == 'check_not_found') {
                        this.snackbarService.showErrorMessage(null, 'Ошибка. Чек не найден!');
                        return of(err);
                    }
                }

                if (err.status == 422) {
                    if (err.error.error.code == 'reminder_already_send') {
                        this.snackbarService.showErrorMessage(null, 'Нельзя напоминать о долге чаще, чем раз в каленарный день!');
                        return of(err);
                    }
                }

                if (err.url.includes('auth') && err.status == 0)
                    throw err;

                this.snackbarService.showErrorMessage(err);
                return of(err);
            }));

    }

}