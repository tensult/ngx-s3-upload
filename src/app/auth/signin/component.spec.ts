import { TestBed, async } from '@angular/core/testing';

import { SigninComponent } from './component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SigninComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(SigninComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Auth'`, async(() => {
    const fixture = TestBed.createComponent(SigninComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toContain('Auth');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(SigninComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Auth');
  }));
});
