import { TestBed } from '@angular/core/testing';

import { PlanificatorService } from './planificator.service';

describe('PlanificatorService', () => {
  let service: PlanificatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
