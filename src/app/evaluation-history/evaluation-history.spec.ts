import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationHistory } from './evaluation-history';

describe('EvaluationHistory', () => {
  let component: EvaluationHistory;
  let fixture: ComponentFixture<EvaluationHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
