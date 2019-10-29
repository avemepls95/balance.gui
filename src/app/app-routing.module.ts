import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckAddComponent } from './Components/check-add/check-add.component';


const routes: Routes = [
  {
    path: 'check/create',
    component: CheckAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
