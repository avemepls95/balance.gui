import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  canLoad(): boolean {
    debugger
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(): boolean {
    debugger
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }

}
