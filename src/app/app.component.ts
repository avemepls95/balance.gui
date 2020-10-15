import { Component, OnInit } from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from './Common/Services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isTicketsTheme: Observable<boolean>;

  constructor(
    private loadingBar: SlimLoadingBarService,
    private router: Router,
    private themeService: ThemeService
  )
  {
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
    this.isTicketsTheme = this.themeService.isTicketsTheme;
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }
}
