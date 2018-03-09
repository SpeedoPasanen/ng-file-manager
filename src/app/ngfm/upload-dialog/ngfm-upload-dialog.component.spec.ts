import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmUploadDialogComponent } from './ngfm-upload-dialog.component';

describe('NgfmUploadDialogComponent', () => {
  let component: NgfmUploadDialogComponent;
  let fixture: ComponentFixture<NgfmUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
