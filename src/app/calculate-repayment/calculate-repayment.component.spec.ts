import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateRepaymentComponent } from './calculate-repayment.component';

describe('CalculateRepaymentComponent', () => {
  let component: CalculateRepaymentComponent;
  let fixture: ComponentFixture<CalculateRepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateRepaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
