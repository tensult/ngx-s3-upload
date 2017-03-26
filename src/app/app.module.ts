import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProgressbarModule } from 'ng2-bootstrap/progressbar';

import { GlobalUploadComponent } from './global-upload/component';
import { FileUploadComponent } from './file-upload/component';

import {FileSizePipe} from '../utils/file-size.pipe';

@NgModule({
  declarations: [
    FileSizePipe,
    GlobalUploadComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ProgressbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [GlobalUploadComponent]
})
export class AppModule { }
