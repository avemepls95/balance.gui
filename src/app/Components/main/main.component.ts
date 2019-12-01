import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceApiService } from 'src/app/Services/balance-api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  Title = 'Balance';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.removeCurrentToken();
    this.router.navigate(['/auth']);
  }
}
