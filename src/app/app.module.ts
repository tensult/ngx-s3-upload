import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { AppRoutesModule } from './app-routes.module';
import {
  SigninComponent,
  SignoutComponent,
  FirstTimePasswordComponent,
  AuthService
} from './auth';
import {
  UploadContainerComponent,
  FileUploadComponent,
  S3Config,
  UploadService
} from './upload';
import { FileSizePipe } from '../utils';
import { S3 } from 'aws-sdk';

@NgModule({
  imports: [
    AppRoutesModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    FileSizePipe,
    FileUploadComponent,
    FirstTimePasswordComponent,
    SigninComponent,
    SignoutComponent,
    UploadContainerComponent
  ],
  providers: [
    AuthService,
    UploadService,
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
