import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../auth/types';
import { ContainerEvents, FileObject } from './types';
import { S3 } from 'aws-sdk';
import { S3Factory } from '../../utils';
import { s3Config } from '../../config';


@Injectable()
export class UploadService {

  // Observable string sources
  private uploadContainerEventSource = new Subject<ContainerEvents>();
  private fileUploadEventSource = new Subject<FileObject>();

  // Observable string streams
  uploadContrainerEvent$ = this.uploadContainerEventSource.asObservable();
  fileUploadEvent$ = this.fileUploadEventSource.asObservable();
  private signedInUser: User;
  private region: string;

  constructor() {
    this.region = s3Config.defaultRegion || 'ap-south-1';
  }

  setSignedInUser(user: User) {
    this.signedInUser = user;
  }

  // Upload status updates
  publishUploadContainerEvent(event: ContainerEvents) {
    this.uploadContainerEventSource.next(event);
  }

  publishFileUploadEvent(file: FileObject) {
    this.fileUploadEventSource.next(file);
  }

  setRegion(region: string) {
    this.region = region;
  }

  private preparePutObjectRequest(file: File, region: string): S3.Types.PutObjectRequest {
    const now = new Date();
    const obj = {
      Key: [this.signedInUser.username,
      this.signedInUser.userId,
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      file.name].join('/'),
      Bucket: s3Config.buckets[region],
      Body: file,
      ContentType: file.type
    };
    return obj;
  }

  upload(file: File, progressCallback: (error: Error, progress: number, speed: number) => void, region?: string) {
    if (!this.signedInUser) {
      progressCallback(new Error('User not signed in'), undefined, undefined);
      return;
    }
    region = region || this.region;
    const s3Upload = S3Factory.getS3(region).upload(this.preparePutObjectRequest(file, region));
    s3Upload.on('httpUploadProgress', this.handleS3UploadProgress(progressCallback));
    s3Upload.send(this.handleS3UploadComplete(progressCallback));
    return s3Upload;
  }

  private handleS3UploadProgress
    (progressCallback: (error: Error, progress: number, speed: number) => void) {
    let uploadStartTime = new Date().getTime();
    let uploadedBytes = 0;
    return (progressEvent: S3.ManagedUpload.Progress) => {
      const currentTime = new Date().getTime();
      const timeElapsedInSeconds = (currentTime - uploadStartTime) / 1000;
      if (timeElapsedInSeconds > 0) {
        const speed = (progressEvent.loaded - uploadedBytes) / timeElapsedInSeconds;
        const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(undefined, progress, speed);
        uploadStartTime = currentTime;
        uploadedBytes = progressEvent.loaded;
      }
    };
  }

  private handleS3UploadComplete(
    progressCallback: (error: Error, progress: number, speed: number) => void) {
    return (error: Error, data: S3.ManagedUpload.SendData) => {
      if (error) {
        progressCallback(error, undefined, undefined);
      } else {
        progressCallback(error, 100, undefined);
      }
    };
  }

  cancel(s3Upload: S3.ManagedUpload) {
    s3Upload.abort();
  }
}
