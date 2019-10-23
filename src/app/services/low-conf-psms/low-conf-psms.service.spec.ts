import { TestBed, inject } from '@angular/core/testing';

import { LowConfPsmsService } from './low-conf-psms.service';

describe('LowConfPsmsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LowConfPsmsService]
    });
  });

  it('should be created', inject([LowConfPsmsService], (service: LowConfPsmsService) => {
    expect(service).toBeTruthy();
  }));
});
