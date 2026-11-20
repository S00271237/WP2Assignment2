import { TestBed } from '@angular/core/testing';

import { Angler } from './services/angler';

describe('Angler', () => {
  let service: Angler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Angler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
