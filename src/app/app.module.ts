import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { AppRoutesModule } from './app-routes.module';
import {
  AuthService,
  FirstTimePasswordComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SigninComponent,
  SignoutComponent
} from './auth';
import {
  HomeComponent
} from './home';
import { S3 } from 'aws-sdk';
import { TermsComponent } from './terms/terms.component';
import { DownloadComponent, DownLoadService } from './download';
import { LoadingComponent } from './loading/component';
import {
  UploadContainerComponent,
  FileUploadComponent,
  UploadService
} from './upload';
import { FileSizePipe } from '../utils';
import {HeaderComponent} from './header/component';
import {FooterComponent} from './footer/component';
 

@NgModule({
  declarations: [
    AppComponent,
    FirstTimePasswordComponent,
    ForgotPasswordComponent,
    HomeComponent,
    LoadingComponent,
    ResetPasswordComponent,
    SigninComponent,
    SignoutComponent,
    TermsComponent,
    DownloadComponent,
    FileSizePipe,
    FileUploadComponent,
    UploadContainerComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    AppRoutesModule,
    BrowserModule,
    FormsModule,
    NgxDatatableModule
  ],
  providers: [
    AuthService,
    DownLoadService,
    UploadService,
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
