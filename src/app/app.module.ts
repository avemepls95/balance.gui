import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckComponent } from './Components/check/check.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TelegramLoginWidget } from './Components/telegram-login-widget/telegram-login-widget.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './Components/auth/auth.component';
import { MainComponent } from './Components/main/main.component';
import { VkLoginWidgetComponent } from './Components/vk-login-widget/vk-login-widget.component';
import { DemoMaterialModule } from './material-module';
import { PositionCardComponent } from './Components/position-card/position-card.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    CheckComponent,
    TelegramLoginWidget,
    AuthComponent,
    MainComponent,
    VkLoginWidgetComponent,
    PositionCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [
    PositionCardComponent,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
