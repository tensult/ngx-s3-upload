import { Ng2S3UploadPage } from './app.po';

describe('ng2-s3-upload App', () => {
  let page: Ng2S3UploadPage;

  beforeEach(() => {
    page = new Ng2S3UploadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
