import { Component, OnInit } from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router } from '@angular/router';
import { TranslateHelper } from './Utils/TranslateHelper';
import { ThemeService } from './core/services/theme.service';
import { Observable } from 'rxjs';

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
    translateHelper: TranslateHelper,
    private themeService: ThemeService
  ) 
  {
    translateHelper.setDefaultLanguage(TranslateHelper.ruKey);
    translateHelper.restoreCurrentLanguage();
    
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