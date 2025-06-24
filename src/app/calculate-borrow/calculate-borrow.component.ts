import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculate-borrow',
  templateUrl: './calculate-borrow.component.html',
  styleUrls: ['./calculate-borrow.component.scss'],
})
export class CalculateBorrowComponent {
  borrowForm: FormGroup;
  borrowAmount: number = 0;

  constructor(private fb: FormBuilder) {
    this.borrowForm = this.fb.group({
      rate: [4, [Validators.required, Validators.min(0.1), Validators.max(30)]],
      years: [30, [Validators.required, Validators.min(1), Validators.max(50)]],
      yIncome: [100000, [Validators.required, Validators.min(0)]],
      mExpense: [0, [Validators.required, Validators.min(0)]],
    });

    // Calculate immediately when values change
    this.borrowForm.valueChanges.subscribe(() => {
      if (this.borrowForm.valid) {
        this.calculate();
      }
    });
  }

  private calc(rate: number, years: number, monthlyPayment: number): number {
    const monthlyRate = rate / 1200;
    const totalPayments = years * 12;
    return (
      (monthlyPayment * (Math.pow(1 + monthlyRate, totalPayments) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))
    );
  }

  calculate(): void {
    const formValues = this.borrowForm.value;
    const monthlyPayment =
      (formValues.yIncome / 12 - formValues.mExpense) * 0.8;
    const calculatedAmount = this.calc(
      formValues.rate,
      formValues.years,
      monthlyPayment
    );
    this.borrowAmount = parseFloat(calculatedAmount.toFixed(2));
  }
}
