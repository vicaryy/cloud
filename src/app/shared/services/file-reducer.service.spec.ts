import { TestBed } from '@angular/core/testing';

import { FileReducerService } from './file-reducer.service';

describe('FileReducerService', () => {
  let service: FileReducerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileReducerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
