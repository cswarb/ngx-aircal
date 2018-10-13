import { TestBed, inject } from '@angular/core/testing';

import { NgxUtilsService } from './ngx-utils.service';

describe('NgxUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxUtilsService]
    });
  });

  it('should be created', inject([NgxUtilsService], (service: NgxUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
