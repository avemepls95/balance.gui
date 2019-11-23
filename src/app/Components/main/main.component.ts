import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  Title = 'Balance';

  constructor(private router: Router) { }

  ngOnInit() {
    //debugger
    //if (LoginService.AuthMethod != AuthMethod.Unauthorized)
    //  return;

    //this.router.navigate(['/auth']);
  }

}
