import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  UrlSerializer,
  UrlTree,
  DefaultUrlSerializer
} from '@angular/router';
import { FirstTimePasswordComponent, SigninComponent, SignoutComponent } from './auth';
import { UploadContainerComponent } from './upload';

const routes: Routes = [
  {
    path: '',
    component: UploadContainerComponent
  },
  {
    path: 'first-time-password',
    component: FirstTimePasswordComponent
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signout',
    component: SignoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
