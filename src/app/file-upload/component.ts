import { Component, Input } from '@angular/core';

/**
 * Contrainer for all uploads.
 */
@Component({
  moduleId: module.id,
  selector: 'app-file-upload',
  templateUrl: 'component.html',
  styleUrls: ['component.css']
})
export class FileUploadComponent {
   @Input() file = {};
  constructor() {
  }
}
