import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckComponent } from './Components/check/check.component';
import { MainComponent } from './Components/main/main.component';
import { AuthComponent } from './Components/auth/auth.component';
import { AuthGuard } from './Guards/auth.guard';
import { CheckListComponent } from './Components/check-list/check-list.component';

const menuRoutes: Routes = [
  { path: 'createCheck', component: CheckComponent },
  { path: 'checks', component: CheckListComponent }
];

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: '', redirectTo: '/main', pathMatch: 'full' },
      { path: 'main', component: MainComponent, children: menuRoutes },
    ]
  },
  { path: 'auth', component: AuthComponent },
  // { path: '**', redirectTo: '/main' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
