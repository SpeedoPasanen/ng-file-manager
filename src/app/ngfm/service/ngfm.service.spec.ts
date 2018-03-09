import { TestBed, inject } from '@angular/core/testing';

import { NgfmService } from './ngfm.service';

describe('NgfmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgfmService]
    });
  });

  it('should be created', inject([NgfmService], (service: NgfmService) => {
    expect(service).toBeTruthy();
  }));
});
