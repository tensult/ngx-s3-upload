import { Component } from '@angular/core';
import { UploadService } from '../upload.service';
import { ContainerEvents, FileObject, FileObjectStatus } from '../../types/upload';
/**
 * Contrainer for all uploads.
 */
@Component({
  moduleId: module.id,
  selector: 'app-upload',
  templateUrl: 'component.html',
  styleUrls: ['component.css']
})
export class UploadContainerComponent {
  files: FileObject[] = [];
  uploadStarted = false;

  constructor(private uploadService: UploadService) {
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
        this.files.push(fileObject);
      }
    }
  }

  uploadAll() {
    console.log('uploading all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Upload);
  }

  cancelAll() {
    console.log('aborting all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Cancel);
  }

  deleteAll() {
    console.log('removing all');
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Delete);
  }
}
