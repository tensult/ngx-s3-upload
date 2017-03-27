import { Component, Input, OnDestroy } from '@angular/core';
import {
  FileObject,
  ContainerEvents,
  FileObjectStatus,
  S3Config
} from '../../types/upload';
import { UploadService } from '../upload.service';
import { Subscription } from 'rxjs/Subscription';
import { S3 } from 'aws-sdk';
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
  @Input() oddRow: boolean;
  FileObjectStatus = FileObjectStatus;
  progress = 0;
  speed = 0;
  uploadError: string;
  containerEventSubscription: Subscription;
  s3: S3;
  s3Config: S3Config;
  s3Upload: S3.ManagedUpload;

  constructor(private uploadService: UploadService) {
    this.containerEventSubscription = uploadService.uploadContrainerEvent$.subscribe(
      containerEvent => this.handleContainerEvent(containerEvent)
    );
    this.s3 = uploadService.s3;
    this.s3Config = uploadService.s3Config;
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
    console.log('uploading', this.fileObject.file.name);
    this.fileObject.status = FileObjectStatus.Uploading;
    this.uploadError = undefined;
    this.progress = 0;
    const objectKey = this.s3Config.folderPath + this.fileObject.file.name;
    const putObjectParams: S3.Types.PutObjectRequest = {
      Key: this.fileObject.file.name,
      Bucket: this.s3Config.bucketName,
      Body: this.fileObject.file,
      ContentType: this.fileObject.file.type
    };
    this.s3Upload = this.s3.upload(putObjectParams);
    this.s3Upload.on('httpUploadProgress', this.handleS3UploadProgress(new Date().getTime(), 0));
    this.s3Upload.send(this.handleS3UploadComplete());
  }

  private handleS3UploadProgress(uploadStartTime: number, uploadedBytes: number) {
    return (progressEvent: S3.ManagedUpload.Progress) => {
      const currentTime = new Date().getTime();
      const timeElapsedInSeconds = (currentTime - uploadStartTime) / 1000;
      if (timeElapsedInSeconds > 0) {
        this.speed = (progressEvent.loaded - uploadedBytes) / timeElapsedInSeconds;
        this.progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        uploadStartTime = currentTime;
        uploadedBytes = progressEvent.loaded;
      }
    };
  }

  private handleS3UploadComplete() {
    return (error: Error, data: S3.ManagedUpload.SendData) => {
      if (error) {
        this.progress = 0;
        this.uploadError = error.message;
        this.fileObject.status = FileObjectStatus.Failed;
      } else {
        this.progress = 100;
        this.fileObject.status = FileObjectStatus.Uploaded;
        console.log('uploaded', this.fileObject.file.name);
      }
    };
  }

  cancel() {
    if (this.fileObject.status === FileObjectStatus.Uploading) {
      console.log('cancelling', this.fileObject.file.name);
      this.fileObject.status = FileObjectStatus.Canceled;
      this.s3Upload.abort();
      this.progress = 0;
    }
  }
  delete() {
    if (this.fileObject.status !== FileObjectStatus.Uploading) {
      console.log('deleting', this.fileObject.file.name);
      this.fileObject.status = FileObjectStatus.Deleted;
      this.uploadService.publishFileUploadEvent(this.fileObject);
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.containerEventSubscription.unsubscribe();
  }
}
