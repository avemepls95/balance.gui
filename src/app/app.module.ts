import { ExecutionResultDeclinedDialogComponent } from './Tickets/Components/execution-result-declined-dialog/execution-result-declined-dialog.component';
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
import { DemoMaterialModule } from './material-module';
import { TextMaskModule } from 'angular2-text-mask';
import { JwtHelper } from 'angular2-jwt';

import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from './Common/core.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { CheckListComponent } from './Balance/Components/CheckRelated/check-list/check-list.component';
import { CheckComponent } from './Balance/Components/CheckRelated/check/check.component';
import { ConsumptionsCardComponent } from './Balance/Components/CheckRelated/consumptions/consumptions-card.component';
import { PaymentCardComponent } from './Balance/Components/CheckRelated/payment-card/payment-card.component';
import { PositionCardComponent } from './Balance/Components/CheckRelated/position-card/position-card.component';
import { DebtRepaidCardComponent } from './Balance/Components/debt-repaid-card/debt-repaid-card.component';
import { MyBalanceComponent } from './Balance/Components/my-balance/my-balance.component';
import { TapeComponent } from './Balance/Components/tape/tape.component';
import { TransferCardComponent } from './Balance/Components/transfer-card/transfer-card.component';
import { AuthComponent } from './Common/Components/AuthRelated/auth/auth.component';
import { TelegramLoginWidget } from './Common/Components/AuthRelated/telegram-login-widget/telegram-login-widget.component';
import { VkLoginWidgetComponent } from './Common/Components/AuthRelated/vk-login-widget/vk-login-widget.component';
import { ConfirmDialogComponent } from './Common/Components/confirm-dialog/confirm-dialog.component';
import { SearchUserControlComponent } from './Common/Components/Controls/search-user-control/search-user-control.component';
import { LoaderComponent } from './Common/Components/loader/loader.component';
import { MainComponent } from './Common/Components/main/main.component';
import { NotificationsInfoComponent } from './Common/Components/notifications-info/notifications-info.component';
import { SettingsComponent } from './Common/Components/settings/settings.component';
import { MaskDirective } from './Common/Directives/mask.directive';
import { RemoveZeroDirective } from './Common/Directives/remove-zero.directive';
import { ResponseInterceptor } from './Common/Interceptors/Response/response.interceptor';
import { TokenInterceptor } from './Common/Interceptors/token.interceptor';
import { LoaderService } from './Common/Services/loader.service';
import { SnackbarService } from './Common/Services/snackbar.service';
import { TicketComponent } from './Tickets/Components/ticket/ticket.component';
import { TicketListComponent } from './Tickets/Components/ticket-list/ticket-list.component';
import { EnumSelectPipe } from './Common/Pipes/EnumSelectPipe';
import { ErrorReponseHandler } from './Common/Interceptors/Response/ErrorReponseHandler';
import { SystemHeaderInterceptor } from './Common/Interceptors/system-header.interceptor';

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
    TicketComponent,
    TicketListComponent,
    EnumSelectPipe,
    ExecutionResultDeclinedDialogComponent
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
    DebtRepaidCardComponent,
    ExecutionResultDeclinedDialogComponent
  ],
  providers: [
    JwtHelper,
    LoaderService,
    SnackbarService,
    CookieService,
    ErrorReponseHandler,
    // AppConfig,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [AppConfig], multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: SystemHeaderInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true, },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
