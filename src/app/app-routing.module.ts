import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { CheckListComponent } from './Components/Domain/CheckRelated/check-list/check-list.component';
import { CheckComponent } from './Components/Domain/CheckRelated/check/check.component';
import { AuthComponent } from './Components/Common/AuthRelated/auth/auth.component';
import { TapeComponent } from './Components/Domain/tape/tape.component';
import { MyBalanceComponent } from './Components/Domain/my-balance/my-balance.component';
import { MainComponent } from './Components/Common/main/main.component';

const menuRoutes: Routes = [
  { path: '', redirectTo: '/debts', pathMatch: 'full' },
  { path: 'checks', component: CheckListComponent },
  { path: 'createCheck', component: CheckComponent },
  { path: 'editCheck/:id', component: CheckComponent, data: { check: {} } },
  { path: 'debts', component: MyBalanceComponent},
  { path: 'tape', component: TapeComponent},
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
