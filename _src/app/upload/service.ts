import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../auth';
import { ContainerEvents, FileObject, S3Config } from './types';
import { S3 } from 'aws-sdk';
import * as dateFormat from 'dateformat';
import { s3Config } from './config';

const folderFormat = 'UTC:yyyy/mm/dd/hh';

export class S3Factory {
  private static s3Clients = {};
  static getS3(regionName?: string) {
    regionName = regionName || s3Config.default;
    if (!S3Factory.s3Clients[regionName]) {
      S3Factory.s3Clients[regionName] = new S3({ region: regionName });
    }
    return S3Factory.s3Clients[regionName];
  }
}
@Injectable()
export class UploadService {

  // Observable string sources
  private uploadContainerEventSource = new Subject<ContainerEvents>();
  private fileUploadEventSource = new Subject<FileObject>();

  // Observable string streams
  uploadContrainerEvent$ = this.uploadContainerEventSource.asObservable();
  fileUploadEvent$ = this.fileUploadEventSource.asObservable();

  constructor(private authService: AuthService) { }

  // Upload status updates
  publishUploadContainerEvent(event: ContainerEvents) {
    this.uploadContainerEventSource.next(event);
  }

  publishFileUploadEvent(file: FileObject) {
    this.fileUploadEventSource.next(file);
  }

  private preparePutObjectRequest(file: File, username: string): S3.Types.PutObjectRequest {
    return {
      Key: [username, dateFormat(new Date(), folderFormat), file.name].join('/'),
      Bucket: s3Config['ap-south-1'],
      Body: file,
      ContentType: file.type
    };
  }

  upload(file: File, progressCallback: (error: Error, progress: number, speed: number) => void, region?: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser.signedIn) {
      progressCallback(new Error('User session is expired'), undefined, undefined);
      return;
    }
    const s3Upload = S3Factory.getS3(region).upload(this.preparePutObjectRequest(file, currentUser.username));
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
