import { TestBed, inject } from '@angular/core/testing';

import { ConfigResolverService } from './config-resolver.service';

describe('ConfigResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigResolverService]
    });
  });

  it('should be created', inject([ConfigResolverService], (service: ConfigResolverService) => {
    expect(service).toBeTruthy();
  }));
});
