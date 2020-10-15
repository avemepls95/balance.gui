import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('/auth/')) {
            return next.handle(request);
        }

        let token = this.auth.getToken();
        if (token == null) {
            this.router.navigate(['/auth']);
            return EMPTY;
        }

        const authRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.getToken()}`
            }
        });

        return next.handle(authRequest);
    }
}

