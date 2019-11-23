import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Injectable } from '@angular/core';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger

        return next.handle(request).do(
            (event: HttpEvent<any>) => {},
            (err: any) => {}
        );
    }

    handleResponseError(err: any) {
        debugger
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
                this.router.navigate(['/auth']);
            }
        }
    }
}
