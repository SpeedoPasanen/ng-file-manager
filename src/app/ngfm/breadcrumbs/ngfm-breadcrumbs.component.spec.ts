import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgfmBreadcrumbsComponent } from './ngfm-breadcrumbs.component';

describe('NgfmBreadcrumbsComponent', () => {
  let component: NgfmBreadcrumbsComponent;
  let fixture: ComponentFixture<NgfmBreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgfmBreadcrumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgfmBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
