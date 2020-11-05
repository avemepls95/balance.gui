import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckListComponent } from './Balance/Components/CheckRelated/check-list/check-list.component';
import { CheckComponent } from './Balance/Components/CheckRelated/check/check.component';
import { MyBalanceComponent } from './Balance/Components/my-balance/my-balance.component';
import { TapeComponent } from './Balance/Components/tape/tape.component';
import { AuthComponent } from './Common/Components/AuthRelated/auth/auth.component';
import { MainComponent } from './Common/Components/main/main.component';
import { SettingsComponent } from './Common/Components/settings/settings.component';
import { AuthGuard } from './Common/Guards/auth.guard';
import { TicketListComponent } from './Tickets/Components/ticket-list/ticket-list.component';
import { TicketComponent } from './Tickets/Components/ticket/ticket.component';

const menuRoutes: Routes = [
  { path: '', redirectTo: '/debts', pathMatch: 'full' },
  { path: 'checks', component: CheckListComponent },
  { path: 'createCheck', component: CheckComponent },
  { path: 'editCheck/:id', component: CheckComponent, data: { check: {} } },
  { path: 'debts', component: MyBalanceComponent},
  { path: 'tape', component: TapeComponent},
  
  { path: 'createTicket', component: TicketComponent },
  { path: 'editTicket/:id', component: TicketComponent, data: { ticket: {} } },
  { path: 'tickets', component: TicketListComponent },
  
  { path: 'settings', component: SettingsComponent},
];

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: '', component: MainComponent, children: menuRoutes },
    ]
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
