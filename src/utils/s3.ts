import { S3 } from 'aws-sdk';

export class S3Factory {
    private static s3Clients = {};
    static getS3(regionName: string) {
      if (!S3Factory.s3Clients[regionName]) {
        S3Factory.s3Clients[regionName] = new S3({ region: regionName });
      }
      return S3Factory.s3Clients[regionName] as S3;
    }
  }