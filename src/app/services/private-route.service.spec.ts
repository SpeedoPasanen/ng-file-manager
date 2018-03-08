import { TestBed, inject } from '@angular/core/testing';

import { PrivateRouteService } from './private-route.service';

describe('PrivateRouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateRouteService]
    });
  });

  it('should be created', inject([PrivateRouteService], (service: PrivateRouteService) => {
    expect(service).toBeTruthy();
  }));
});
