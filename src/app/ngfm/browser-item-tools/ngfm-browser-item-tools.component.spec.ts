import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmBrowserItemToolsComponent } from './ngfm-browser-item-tools.component';

describe('NgfmBrowserItemToolsComponent', () => {
  let component: NgfmBrowserItemToolsComponent;
  let fixture: ComponentFixture<NgfmBrowserItemToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmBrowserItemToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmBrowserItemToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
