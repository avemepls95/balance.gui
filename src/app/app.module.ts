import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './Components/Common/main/main.component';
import { DemoMaterialModule } from './material-module';
import { TextMaskModule } from 'angular2-text-mask';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { JwtHelper } from 'angular2-jwt';
import { LoaderService } from './Services/loader.service';
import { DigitOnlyDirective } from './Directives/digit-only.directive';
import { SnackbarService } from './Services/snackbar.service';
import { MyBalanceComponent } from './Components/Domain/my-balance/my-balance.component';
import { CheckComponent } from './Components/Domain/CheckRelated/check/check.component';
import { TelegramLoginWidget } from './Components/Common/AuthRelated/telegram-login-widget/telegram-login-widget.component';
import { AuthComponent } from './Components/Common/AuthRelated/auth/auth.component';
import { VkLoginWidgetComponent } from './Components/Common/AuthRelated/vk-login-widget/vk-login-widget.component';
import { PositionCardComponent } from './Components/Domain/CheckRelated/position-card/position-card.component';
import { PaymentCardComponent } from './Components/Domain/CheckRelated/payment-card/payment-card.component';
import { LoaderComponent } from './Components/Common/loader/loader.component';
import { CheckListComponent } from './Components/Domain/CheckRelated/check-list/check-list.component';
import { ConfirmDialogComponent } from './Components/Common/confirm-dialog/confirm-dialog.component';
import { TransferCardComponent } from './Components/Domain/transfer-card/transfer-card.component';
import { ConsumptionsCardComponent } from './Components/Domain/CheckRelated/consumptions/consumptions-card.component';
import { TapeComponent } from './Components/Domain/tape/tape.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { SettingsComponent } from './Components/Common/settings/settings.component';
import { TranslateHelper } from './Utils/TranslateHelper';
import { MaskDirective } from './Directives/mask.directive';
import { ResponseInterceptor } from './Interceptors/response.interceptor';
import { CheckPermissionsResolver } from './Model/Utils/CheckPermissionsResolver';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
    MaskDirective,
    CheckListComponent,
    ConfirmDialogComponent,
    MyBalanceComponent,
    TransferCardComponent,
    ConsumptionsCardComponent,
    TapeComponent,
    SettingsComponent
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
    CookieService,
    TranslateHelper,
    // AppConfig,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [AppConfig], multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true, },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
