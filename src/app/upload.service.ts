import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ContainerEvents, FileObject, S3Config } from '../types/upload';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {

  // Observable string sources
  private uploadContainerEventSource = new Subject<ContainerEvents>();
  private fileUploadEventSource = new Subject<FileObject>();

  // Observable string streams
  uploadContrainerEvent$ = this.uploadContainerEventSource.asObservable();
  fileUploadEvent$ = this.fileUploadEventSource.asObservable();

  constructor(public s3: S3, public s3Config: S3Config) {}

  // Upload status updates
  publishUploadContainerEvent(event: ContainerEvents) {
    this.uploadContainerEventSource.next(event);
  }

  publishFileUploadEvent(file: FileObject) {
    this.fileUploadEventSource.next(file);
  }
}
