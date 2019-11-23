import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private loginService: AuthService) { }

  ngOnInit() {
    debugger
  }

  test() {
    debugger
    this.loginService.loginViaVk(null);
  }
}
