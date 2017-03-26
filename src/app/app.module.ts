import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {UploadService} from './upload.service';
import { UploadContainerComponent } from './upload-container/component';
import { FileUploadComponent } from './file-upload/component';

import {FileSizePipe} from '../utils/file-size.pipe';

@NgModule({
  declarations: [
    FileSizePipe,
    UploadContainerComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [UploadService],
  bootstrap: [UploadContainerComponent]
})
export class AppModule { }
