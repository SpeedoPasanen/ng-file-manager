import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmRouteComponent } from './ngfm-route.component';

describe('NgfmRouteComponent', () => {
  let component: NgfmRouteComponent;
  let fixture: ComponentFixture<NgfmRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
