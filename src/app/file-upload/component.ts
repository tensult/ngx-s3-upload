import { Component, Input, OnDestroy } from '@angular/core';
import { FileObject, ContainerEvents, FileObjectStatus } from '../../types/upload';
import { UploadService } from '../upload.service';
import { Subscription } from 'rxjs/Subscription';
/**
 * Single file upload component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-file-upload',
  templateUrl: 'component.html',
  styleUrls: ['component.css']
})
export class FileUploadComponent implements OnDestroy {
  @Input() fileObject: FileObject;
  FileObjectStatus = FileObjectStatus;
  progress = 0;
  speed = 0;
  containerEventSubscription: Subscription;

  constructor(private uploadService: UploadService) {
    this.containerEventSubscription = uploadService.uploadContrainerEvent$.subscribe(
      containerEvent => this.handleContainerEvent(containerEvent)
      );
  }

  private handleContainerEvent(containerEvent: ContainerEvents) {
    if (containerEvent === ContainerEvents.Upload) {
      return this.fileObject.status === FileObjectStatus.NotStarted && this.upload();
    } else if (containerEvent === ContainerEvents.Cancel) {
      return this.fileObject.status === FileObjectStatus.Uploading && this.cancel();
    } else if (containerEvent === ContainerEvents.Delete) {
      return this.delete();
    }
  }

  upload() {
    console.log('uploading', this.fileObject.index);
    this.fileObject.status = FileObjectStatus.Uploading;
  }
  cancel() {
    console.log('cancelling', this.fileObject.index);
    this.fileObject.status = FileObjectStatus.Canceled;
  }
  delete() {
    console.log('deleting', this.fileObject.index);
    this.fileObject.status = FileObjectStatus.Deleted;
    this.uploadService.publishFileUploadEvent(this.fileObject);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.cancel();
    this.containerEventSubscription.unsubscribe();
  }
}
