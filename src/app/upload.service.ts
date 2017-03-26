import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {ContainerEvents, FileObject} from '../types/upload';

@Injectable()
export class UploadService {

  // Observable string sources
  private uploadContainerEventSource = new Subject<ContainerEvents>();
  private fileUploadEventSource = new Subject<FileObject>();

  // Observable string streams
  uploadContrainerEvent$ = this.uploadContainerEventSource.asObservable();
  fileUploadEvent$ = this.fileUploadEventSource.asObservable();

  // Upload status updates
  publishUploadContainerEvent(event: ContainerEvents) {
    this.uploadContainerEventSource.next(event);
  }

  publishFileUploadEvent(file: FileObject) {
    this.fileUploadEventSource.next(file);
  }
}
