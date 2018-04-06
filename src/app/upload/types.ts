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
