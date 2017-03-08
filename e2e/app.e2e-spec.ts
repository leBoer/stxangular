import { StxAngularPage } from './app.po';

describe('stx-angular App', () => {
  let page: StxAngularPage;

  beforeEach(() => {
    page = new StxAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
