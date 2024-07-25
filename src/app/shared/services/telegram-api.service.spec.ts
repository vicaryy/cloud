import { TestBed } from '@angular/core/testing';

import { TelegramApiService } from './telegram-api.service';

describe('TelegramApiService', () => {
  let service: TelegramApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelegramApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
