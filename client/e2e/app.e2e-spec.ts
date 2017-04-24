import { WebStarterPage } from './app.po';

describe('web-starter App', () => {
  let page: WebStarterPage;

  beforeEach(() => {
    page = new WebStarterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
