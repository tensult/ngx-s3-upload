import { TensultWebsitePage } from './app.po';

describe('tensult-website App', () => {
  let page: TensultWebsitePage;

  beforeEach(() => {
    page = new TensultWebsitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
