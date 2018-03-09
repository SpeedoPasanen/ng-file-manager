import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmDialogComponent } from './ngfm-dialog.component';

describe('NgfmDialogComponent', () => {
  let component: NgfmDialogComponent;
  let fixture: ComponentFixture<NgfmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
