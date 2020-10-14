import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
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
import { SnackbarService } from './Services/snackbar.service';
import { MyBalanceComponent } from './Components/Balance/my-balance/my-balance.component';
import { CheckComponent } from './Components/Balance/CheckRelated/check/check.component';
import { TelegramLoginWidget } from './Components/Common/AuthRelated/telegram-login-widget/telegram-login-widget.component';
import { AuthComponent } from './Components/Common/AuthRelated/auth/auth.component';
import { VkLoginWidgetComponent } from './Components/Common/AuthRelated/vk-login-widget/vk-login-widget.component';
import { PositionCardComponent } from './Components/Balance/CheckRelated/position-card/position-card.component';
import { PaymentCardComponent } from './Components/Balance/CheckRelated/payment-card/payment-card.component';
import { LoaderComponent } from './Components/Common/loader/loader.component';
import { CheckListComponent } from './Components/Balance/CheckRelated/check-list/check-list.component';
import { ConfirmDialogComponent } from './Components/Common/confirm-dialog/confirm-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { SettingsComponent } from './Components/Common/settings/settings.component';
import { MaskDirective } from './Directives/mask.directive';
import { RemoveZeroDirective } from './Directives/remove-zero.directive';
import { ResponseInterceptor } from './Interceptors/response.interceptor';
import { NotificationsInfoComponent } from './Components/Common/notifications-info/notifications-info.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from './core/core.module';
import { TicketComponent } from './Components/Tickets/ticket/ticket.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { SearchUserControlComponent } from './Components/Controls/search-user-control/search-user-control.component';
import { ConsumptionsCardComponent } from './Components/Balance/CheckRelated/consumptions/consumptions-card.component';
import { DebtRepaidCardComponent } from './Components/Balance/debt-repaid-card/debt-repaid-card.component';
import { TapeComponent } from './Components/Balance/tape/tape.component';
import { TransferCardComponent } from './Components/Balance/transfer-card/transfer-card.component';

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
    MaskDirective,
    RemoveZeroDirective,
    CheckListComponent,
    ConfirmDialogComponent,
    MyBalanceComponent,
    TransferCardComponent,
    ConsumptionsCardComponent,
    TapeComponent,
    SettingsComponent,
    NotificationsInfoComponent,
    SearchUserControlComponent,
    DebtRepaidCardComponent,
    TicketComponent
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
    InfiniteScrollModule,
    NgxSpinnerModule,
    CoreModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxSpinnerModule,
    CoreModule
  ],
  entryComponents: [
    PositionCardComponent,
    PaymentCardComponent,
    ConfirmDialogComponent,
    TransferCardComponent,
    ConsumptionsCardComponent,
    NotificationsInfoComponent,
    DebtRepaidCardComponent
  ],
  providers: [
    JwtHelper,
    LoaderService,
    SnackbarService,
    CookieService,
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
