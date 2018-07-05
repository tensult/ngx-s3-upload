import { Injectable } from '@angular/core';
import { User } from '../auth/types';
import { S3Factory } from '../../utils';
import { s3Config } from '../../config';

@Injectable()
export class DownLoadService {

  private signedInUser: User;
  private defaultRegion: string;
  private signedUrlExpireSeconds = 60 * 5;


  constructor() {
    this.defaultRegion = 'ap-south-1';
  }

  setSignedInUser(user: User) {
    this.signedInUser = user;
  }

  // Upload status updates

  setRegion(region: string) {
    this.defaultRegion = region;
  }

  listFiles() {
    return S3Factory.getS3(this.defaultRegion).listObjectsV2({
      Bucket: s3Config[this.defaultRegion],
      Prefix: [this.signedInUser.username, this.signedInUser.userId].join('/')
    }).promise();
  }

  getUrl(key: string) {
    return S3Factory.getS3(this.defaultRegion).getSignedUrl('getObject', {
      Bucket: s3Config[this.defaultRegion],
      Key: key,
      Expires: this.signedUrlExpireSeconds
    });
  }

}
