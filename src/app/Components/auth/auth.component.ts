import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { LoaderService } from 'src/app/Services/loader.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isAuthError: boolean = false;

  constructor(private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    public loaderService: LoaderService) { }

  ngOnInit() {
    // if (!this.authService.isAuthenticated())
    //   return;

    // this.router.navigate(['/main']);
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
}
