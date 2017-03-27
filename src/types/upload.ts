export enum ContainerEvents {
  Upload,
  Cancel,
  Delete
}

export enum FileObjectStatus {
  NotStarted,
  Uploading,
  Uploaded,
  Canceled,
  Deleted,
  Failed
}

export class FileObject {
  status = FileObjectStatus.NotStarted;

  constructor(public file: File) { }
}

export interface S3ConfigParams {
  bucketName: string;
  folderPath?: string;
}

export class S3Config {
  bucketName: string;
  folderPath?: string;
  constructor(params: S3ConfigParams) {
    this.bucketName = params.bucketName;
    // Making sure folderPath ends with only one /
    this.folderPath = params.folderPath ? params.folderPath.replace(/\/*$/, '/') : '';
  }
}
