import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckComponent } from './Components/check/check.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TelegramLoginWidget } from './Components/telegram-login-widget/telegram-login-widget.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './Components/auth/auth.component';
import { MainComponent } from './Components/main/main.component';
import { VkLoginWidgetComponent } from './Components/vk-login-widget/vk-login-widget.component';
import { DemoMaterialModule } from './material-module';
import { PositionCardComponent } from './Components/position-card/position-card.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { ResponseInterceptor } from './Interceptors/response.interceptor';
import { JwtHelper } from 'angular2-jwt';
import { LoaderComponent } from './Components/loader/loader.component';
import { LoaderService } from './Services/loader.service';
import { PaymentCardComponent } from './Components/payment-card/payment-card.component';
import { DigitOnlyDirective } from './Directives/digit-only.directive';
import { CheckListComponent } from './Components/check-list/check-list.component';
import { SnackbarService } from './Services/snackbar.service';
import { ConfirmDialogComponent } from './Components/confirm-dialog/confirm-dialog.component';
import { MyBalanceComponent } from './Components/my-balance/my-balance.component';

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
    PaymentCardComponent,
    LoaderComponent,
    DigitOnlyDirective,
    CheckListComponent,
    ConfirmDialogComponent,
    MyBalanceComponent,
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
    ToastrModule.forRoot(),
    TextMaskModule,
  ],
  entryComponents: [
    PositionCardComponent,
    PaymentCardComponent,
    ConfirmDialogComponent
  ],
  providers: [
    JwtHelper,
    LoaderService,
    SnackbarService,
    // AppConfig,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [AppConfig], multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
