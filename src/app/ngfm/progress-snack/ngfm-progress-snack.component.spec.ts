import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmProgressSnackComponent } from './ngfm-progress-snack.component';

describe('NgfmProgressSnackComponent', () => {
  let component: NgfmProgressSnackComponent;
  let fixture: ComponentFixture<NgfmProgressSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmProgressSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmProgressSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
