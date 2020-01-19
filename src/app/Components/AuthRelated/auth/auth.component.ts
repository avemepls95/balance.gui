import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { LoaderService } from 'src/app/Services/loader.service';
import { LocalStorageManager } from 'src/app/LocalStorageManager';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isAuthError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public loaderService: LoaderService,
    private ngZone: NgZone) { }

  ngOnInit() {
    if (!this.authService.isAuthenticated())
      return;

    this.router.navigate(['/main']);
  }

  setIsAuthError(value: boolean) {
    this.isAuthError = value;
    this.cdRef.detectChanges();
  }

  loginStarted() {
    this.loaderService.show();
  }

  loginEnded() {
    this.loaderService.hide();
  }

  loginSuccessful(response) {
    this.authService.setToken(response.data.token);
    LocalStorageManager.setUserId(response.data.user.id);
    
    this.ngZone.run(() => this.router.navigate(['/main']));
  }
}
