import { TestBed } from '@angular/core/testing';

import { CompanySelectService } from './company-select.service';

describe('CompanySelectService', () => {
  let service: CompanySelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
