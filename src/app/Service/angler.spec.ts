import { TestBed } from '@angular/core/testing';
import { AnglerService } from './angler';


describe('Angler', () => {
  let service: AnglerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnglerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
