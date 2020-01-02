import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { MyBalanceComponent } from './Components/my-balance/my-balance.component';
import { CheckListComponent } from './Components/CheckRelated/check-list/check-list.component';
import { CheckComponent } from './Components/CheckRelated/check/check.component';
import { MainComponent } from './Components/main/main.component';
import { AuthComponent } from './Components/AuthRelated/auth/auth.component';

const menuRoutes: Routes = [
  { path: '', redirectTo: '/debts', pathMatch: 'full' },
  { path: 'checks', component: CheckListComponent },
  { path: 'createCheck', component: CheckComponent },
  { path: 'editCheck/:id', component: CheckComponent },
  { path: 'debts', component: MyBalanceComponent},
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
