import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  test() {
    debugger
    this.loginService.loginViaVk(null);
  }
}
