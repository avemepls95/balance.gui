import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class SystemHeaderInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var systemKey = request.url.indexOf(environment.balanceApiUrl) != -1 
            ? 'balance' 
            : 'tickets';

        const authRequest = request.clone({
            setHeaders: {
                System: systemKey
            }
        });

        return next.handle(authRequest);
    }
}

