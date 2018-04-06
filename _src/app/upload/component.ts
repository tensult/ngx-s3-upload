import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from './service';
import { ContainerEvents, FileObject, FileObjectStatus } from './types';
import { AuthService, User } from '../auth';

/**
 * Contrainer for all uploads.
 */
@Component({
  moduleId: module.id,
  selector: 'app-upload',
  templateUrl: 'component.html',
  styleUrls: ['component.scss']
})
export class UploadContainerComponent implements OnInit {
  files: FileObject[] = [];
  signedInUser: User;
  uploadStarted = false;

  constructor(private authService: AuthService,
    private router: Router,
    private uploadService: UploadService) {
    uploadService.fileUploadEvent$.subscribe(
      fileObject => this.handleFileUploadEvent(fileObject)
    );
  }

  private handleFileUploadEvent(fileObject: FileObject) {
    if (fileObject.status === FileObjectStatus.Deleted) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i] === fileObject) {
          this.files.splice(i, 1);
        }
      }
    }
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files.length) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const fileObject = new FileObject(fileInput.target.files[i]);
        console.log(fileObject);
        this.files.push(fileObject);
      }
    }
    fileInput.target.value = null;
  }

  uploadAll() {
    console.log('uploading all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Upload);
  }

  cancelAll() {
    console.log('aborting all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Cancel);
  }

  clearAll() {
    console.log('clearing all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Delete);
  }

  ngOnInit() {
    this.signedInUser = this.authService.getCurrentUser();
    if (!this.signedInUser || !this.signedInUser.signedIn) {
      this.router.navigate(['signin']);
    }
  }
}
