import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmBrowserComponent } from './ngfm-browser.component';

describe('NgfmBrowserComponent', () => {
  let component: NgfmBrowserComponent;
  let fixture: ComponentFixture<NgfmBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
