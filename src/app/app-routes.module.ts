import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  UrlSerializer,
  UrlTree,
  DefaultUrlSerializer
} from '@angular/router';
import {
  FirstTimePasswordComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SigninComponent,
  SignoutComponent
} from './auth';
import {HomeComponent} from './home';
import {TermsComponent} from './terms/terms.component';
import { DownloadComponent } from './download';
import { UploadContainerComponent } from './upload';

const routes: Routes = [
  {
    path: 'first-time-password',
    component: FirstTimePasswordComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'signout',
    component: SignoutComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'upload',
    component: UploadContainerComponent
  },
  {
    path: 'files',
    component: DownloadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
