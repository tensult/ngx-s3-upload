import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { UploadService } from './upload.service';
import { UploadContainerComponent } from './upload-container/component';
import { FileUploadComponent } from './file-upload/component';

import { S3Config } from '../types/upload';
import { FileSizePipe } from '../utils/file-size.pipe';
import { S3 } from 'aws-sdk';

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
  providers: [
    UploadService,
    { provide: S3, useValue: new S3() },
    {
      provide: S3Config, useValue: new S3Config({
        bucketName: 'bucketName',
        folderPath: 'optional folderPath'
      })
    }
  ],
  bootstrap: [UploadContainerComponent]
})
export class AppModule {}
