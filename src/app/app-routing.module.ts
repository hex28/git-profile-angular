import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'profile/:username',
    component: ProfileComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
