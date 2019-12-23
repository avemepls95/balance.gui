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
  avatar: string;

  constructor(private router: Router, private authService: AuthService) { 
    this.userFirstName = localStorage.getItem(LocalStorageManager.userFirstNameKey);
    this.avatar = localStorage.getItem(LocalStorageManager.userPhotoUrlKey); 
  }

  ngOnInit() {

  }

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
