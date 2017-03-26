import { Component } from '@angular/core';

/**
 * Contrainer for all uploads.
 */
@Component({
  moduleId: module.id,
  selector: 'app-upload',
  templateUrl: 'component.html',
  styleUrls: ['component.css']
})
export class GlobalUploadComponent {
  files: File[] = [];
  uploadStarted = false;
  constructor() {
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files.length) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        this.files.push(fileInput.target.files[i]);
      }
    }
  }
}
