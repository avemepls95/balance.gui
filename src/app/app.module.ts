import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './Components/main/main.component';
import { DemoMaterialModule } from './material-module';
import { TextMaskModule } from 'angular2-text-mask';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { ResponseInterceptor } from './Interceptors/response.interceptor';
import { JwtHelper } from 'angular2-jwt';
import { LoaderService } from './Services/loader.service';
import { DigitOnlyDirective } from './Directives/digit-only.directive';
import { SnackbarService } from './Services/snackbar.service';
import { MyBalanceComponent } from './Components/my-balance/my-balance.component';
import { CheckComponent } from './Components/CheckRelated/check/check.component';
import { TelegramLoginWidget } from './Components/AuthRelated/telegram-login-widget/telegram-login-widget.component';
import { AuthComponent } from './Components/AuthRelated/auth/auth.component';
import { VkLoginWidgetComponent } from './Components/AuthRelated/vk-login-widget/vk-login-widget.component';
import { PositionCardComponent } from './Components/CheckRelated/position-card/position-card.component';
import { PaymentCardComponent } from './Components/CheckRelated/payment-card/payment-card.component';
import { LoaderComponent } from './Components/Common/loader/loader.component';
import { CheckListComponent } from './Components/CheckRelated/check-list/check-list.component';
import { ConfirmDialogComponent } from './Components/Common/confirm-dialog/confirm-dialog.component';
import { TransferCardComponent } from './Components/transfer-card/transfer-card.component';
import { ConsumptionsCardComponent } from './Components/CheckRelated/consumptions/consumptions-card.component';

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
    TransferCardComponent,
    ConsumptionsCardComponent,
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
    ConfirmDialogComponent,
    TransferCardComponent,
    ConsumptionsCardComponent
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
