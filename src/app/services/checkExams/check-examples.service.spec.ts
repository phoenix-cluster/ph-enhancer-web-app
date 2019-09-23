import { TestBed, inject } from '@angular/core/testing';

import { CheckExamplesService } from './check-examples.service';

describe('CheckExamplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckExamplesService]
    });
  });

  it('should be created', inject([CheckExamplesService], (service: CheckExamplesService) => {
    expect(service).toBeTruthy();
  }));
});
