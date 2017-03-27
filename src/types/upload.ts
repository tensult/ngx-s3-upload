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
  Deleted
}

export class FileObject {
  status = FileObjectStatus.NotStarted;

  constructor(public file: File) { }
}
