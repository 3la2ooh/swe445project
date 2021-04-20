import { TestBed } from '@angular/core/testing';

import { CatalogResolver } from './catalog.resolver';

describe('CatalogResolver', () => {
  let resolver: CatalogResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CatalogResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
