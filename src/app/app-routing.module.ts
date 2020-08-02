import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { CheckListComponent } from './Components/Balance/CheckRelated/check-list/check-list.component';
import { CheckComponent } from './Components/Balance/CheckRelated/check/check.component';
import { AuthComponent } from './Components/Common/AuthRelated/auth/auth.component';
import { TapeComponent } from './Components/Balance/tape/tape.component';
import { MyBalanceComponent } from './Components/Balance/my-balance/my-balance.component';
import { MainComponent } from './Components/Common/main/main.component';
import { SettingsComponent } from './Components/Common/settings/settings.component';

const menuRoutes: Routes = [
  { path: '', redirectTo: '/debts', pathMatch: 'full' },
  { path: 'checks', component: CheckListComponent },
  { path: 'createCheck', component: CheckComponent },
  { path: 'editCheck/:id', component: CheckComponent, data: { check: {} } },
  { path: 'debts', component: MyBalanceComponent},
  { path: 'tape', component: TapeComponent},
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
