import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { PrepPageComponent } from './prep-page/prep-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'prep', component: PrepPageComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
