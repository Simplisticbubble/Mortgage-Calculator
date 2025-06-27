import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-calculate-repayment',
  templateUrl: './calculate-repayment.component.html',
  styleUrls: ['./calculate-repayment.component.scss'],
})
export class CalculateRepaymentComponent {
  borrowForm: FormGroup;
  monthlyRepayments: number = 4774.15;
  repaymentFrequency: 'weekly' | 'fortnightly' | 'monthly' = 'monthly';

  setFrequency(frequency: 'weekly' | 'fortnightly' | 'monthly') {
    this.repaymentFrequency = frequency;
  }

  constructor(private fb: FormBuilder) {
    this.borrowForm = this.fb.group({
      rate: [4, [Validators.required, Validators.min(0.1), Validators.max(30)]],
      years: [30, [Validators.required, Validators.min(1), Validators.max(50)]],
      borrowAmount: [
        1000000,
        [Validators.required, Validators.min(1), Validators.max(1000000000)],
      ],
    });

    // Calculate immediately when values change
    this.borrowForm.valueChanges.subscribe(() => {
      if (this.borrowForm.valid) {
        this.calculate();
      }
    });
  }

  private calc(rate: number, years: number, borrowAmount: number): number {
    const monthlyRate = rate / 1200;
    const totalPayments = years * 12;
    return (
      (borrowAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    );
  }

  calculate(): void {
    const formValues = this.borrowForm.value;
    const calculatedAmount = this.calc(
      formValues.rate,
      formValues.years,
      formValues.borrowAmount
    );
    this.monthlyRepayments = parseFloat(calculatedAmount.toFixed(2));
  }
}
