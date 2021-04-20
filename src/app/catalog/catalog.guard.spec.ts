import { TestBed } from '@angular/core/testing';

import { CatalogGuard } from './catalog.guard';

describe('CatalogGuard', () => {
  let guard: CatalogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CatalogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
