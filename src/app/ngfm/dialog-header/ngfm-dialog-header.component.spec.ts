import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmDialogHeaderComponent } from './ngfm-dialog-header.component';

describe('NgfmDialogHeaderComponent', () => {
  let component: NgfmDialogHeaderComponent;
  let fixture: ComponentFixture<NgfmDialogHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmDialogHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
