import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckAddComponent } from './Components/check-add/check-add.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TelegramLoginWidgetComponentComponent } from './Components/telegram-login-widget-component/telegram-login-widget-component.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckAddComponent,
    TelegramLoginWidgetComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
