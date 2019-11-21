import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckComponent } from './Components/check/check.component';
import { MainComponent } from './Components/main/main.component';
import { AuthComponent } from './Components/auth/auth.component';

const menuRoutes: Routes = [
  { path: 'createCheck', component: CheckComponent }
];

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'main', component: MainComponent },
  { path: 'main', component: MainComponent, children: menuRoutes },
  // { path: 'check/create', component: CheckComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
