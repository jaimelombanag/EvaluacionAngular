import { TestBed } from '@angular/core/testing';

import { EvaluationData } from './evaluation-data';

describe('EvaluationData', () => {
  let service: EvaluationData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
