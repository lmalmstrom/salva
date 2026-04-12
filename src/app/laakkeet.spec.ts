import { TestBed } from '@angular/core/testing';

import { LaakeService } from './laake';

describe('Laakkeet', () => {
  let service: LaakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
