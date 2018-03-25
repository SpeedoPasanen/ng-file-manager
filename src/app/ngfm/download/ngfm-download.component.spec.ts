import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmDownloadComponent } from './ngfm-download.component';

describe('NgfmDownloadComponent', () => {
  let component: NgfmDownloadComponent;
  let fixture: ComponentFixture<NgfmDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
