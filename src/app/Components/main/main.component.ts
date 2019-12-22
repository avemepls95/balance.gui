import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { LocalStorageManager } from 'src/app/LocalStorageManager';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string = 'Balance';
  userFirstName: string;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userFirstName = localStorage.getItem(LocalStorageManager.userFirstNameKey);
    (document.getElementsByClassName("avatar-header-image")[0] as HTMLElement).style.backgroundImage = 
      'url(\'' + localStorage.getItem(LocalStorageManager.userPhotoUrlKey) + '\')';
  }

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
