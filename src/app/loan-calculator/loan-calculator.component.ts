import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss'],
})
export class LoanCalculatorComponent implements OnInit {
  @ViewChild('loanChart', { static: true }) chartRef!: ElementRef;
  loanForm: FormGroup;
  chart: any;
  showResults = false;
  showAmortization = false;

  // Calculation results
  totalInterest = 0;
  totalCost = 0;
  payoffYears = 0;
  payoffMonths = 0;
  minPayment = 0;
  amortizationSchedule: any[] = [];

  constructor(private fb: FormBuilder) {
    Chart.register(...registerables);
    this.loanForm = this.fb.group({
      loanAmount: [10000, [Validators.required, Validators.min(1000)]],
      interestRate: [
        5,
        [Validators.required, Validators.min(0.1), Validators.max(20)],
      ],
      loanTerm: [
        5,
        [Validators.required, Validators.min(1), Validators.max(30)],
      ],
      monthlyPayment: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.calculateMinPayment();
    this.loanForm.valueChanges.subscribe(() => {
      this.calculateMinPayment();
    });
  }

  calculateMinPayment(): void {
    const formValues = this.loanForm.value;
    if (
      !formValues.loanAmount ||
      !formValues.interestRate ||
      !formValues.loanTerm
    )
      return;

    const principal = formValues.loanAmount;
    const annualRate = formValues.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const payments = formValues.loanTerm * 12;

    this.minPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);

    if (
      !formValues.monthlyPayment ||
      formValues.monthlyPayment < this.minPayment
    ) {
      this.loanForm.patchValue({ monthlyPayment: this.minPayment.toFixed(2) });
    }
  }

  calculateLoan(): void {
    if (this.loanForm.invalid) return;

    const formValues = this.loanForm.value;
    const principal = formValues.loanAmount;
    const annualRate = formValues.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const monthlyPayment = formValues.monthlyPayment;

    let balance = principal;
    let totalInterest = 0;
    let month = 0;
    this.amortizationSchedule = [];

    while (balance > 0 && month < 1200) {
      // Cap at 100 years to prevent infinite loops
      const interest = balance * monthlyRate;
      let principalPayment = monthlyPayment - interest;

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      totalInterest += interest;
      balance -= principalPayment;
      month++;

      this.amortizationSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest,
        balance: balance > 0 ? balance : 0,
      });

      if (balance <= 0) break;
    }

    this.totalInterest = totalInterest;
    this.totalCost = principal + totalInterest;
    this.payoffYears = Math.floor(month / 12);
    this.payoffMonths = month % 12;
    this.showResults = true;

    this.createChart();
  }

  // createChart(): void {
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   const labels = [];
  //   const principalData = [];
  //   const interestData = [];
  //   const balanceData = [];

  //   for (
  //     let i = 0;
  //     i < this.amortizationSchedule.length;
  //     i += Math.ceil(this.amortizationSchedule.length / 12)
  //   ) {
  //     const payment = this.amortizationSchedule[i];
  //     labels.push(`Year ${Math.ceil(payment.month / 12)}`);
  //     principalData.push(payment.principal);
  //     interestData.push(payment.interest);
  //     balanceData.push(payment.balance);
  //   }

  //   const ctx = this.chartRef.nativeElement.getContext('2d');
  //   this.chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'Principal',
  //           data: principalData,
  //           backgroundColor: 'rgba(54, 162, 235, 0.7)',
  //           borderColor: 'rgba(54, 162, 235, 1)',
  //           borderWidth: 1,
  //         },
  //         {
  //           label: 'Interest',
  //           data: interestData,
  //           backgroundColor: 'rgba(255, 99, 132, 0.7)',
  //           borderColor: 'rgba(255, 99, 132, 1)',
  //           borderWidth: 1,
  //         },
  //         {
  //           label: 'Remaining Balance',
  //           data: balanceData,
  //           type: 'line',
  //           borderColor: 'rgba(75, 192, 192, 1)',
  //           borderWidth: 2,
  //           fill: false,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         x: {
  //           stacked: true,
  //         },
  //         y: {
  //           stacked: false,
  //           beginAtZero: true,
  //           title: {
  //             display: true,
  //             text: 'Amount ($)',
  //           },
  //         },
  //       },
  //       plugins: {
  //         title: {
  //           display: true,
  //           text: 'Loan Payoff Progress',
  //         },
  //         tooltip: {
  //           callbacks: {
  //             afterBody: (context) => {
  //               const index =
  //                 context[0].dataIndex *
  //                 Math.ceil(this.amortizationSchedule.length / 12);
  //               const payment = this.amortizationSchedule[index];
  //               return `Month: ${
  //                 payment.month
  //               }\nRemaining: $${payment.balance.toFixed(2)}`;
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    interface YearlyData {
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }
    // Group data by year for better visualization
    const yearlyData: YearlyData[] = [];
    let currentYear = 1;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    let currentBalance = this.loanForm.value.loanAmount;

    for (let i = 0; i < this.amortizationSchedule.length; i++) {
      const payment = this.amortizationSchedule[i];
      yearlyPrincipal += payment.principal;
      yearlyInterest += payment.interest;
      currentBalance = payment.balance;

      // Group by year or at the end of schedule
      if ((i + 1) % 12 === 0 || i === this.amortizationSchedule.length - 1) {
        yearlyData.push({
          year: currentYear,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          balance: currentBalance,
        });
        currentYear++;
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: yearlyData.map((data) => `Year ${data.year}`),
        datasets: [
          {
            label: 'Principal Paid',
            data: yearlyData.map((data) => data.principal),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Interest Paid',
            data: yearlyData.map((data) => data.interest),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Remaining Balance',
            data: yearlyData.map((data) => data.balance),
            type: 'line',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Loan Term (Years)',
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)',
            },
            ticks: {
              callback: function (value) {
                return '$' + value.toLocaleString();
              },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Loan Payoff Progress',
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '$' + context.parsed.y.toLocaleString();
                }
                return label;
              },
              footer: (tooltipItems) => {
                const yearIndex = tooltipItems[0].dataIndex;
                const yearData = yearlyData[yearIndex];
                return [
                  `Year ${yearData.year} Total: $${(
                    yearData.principal + yearData.interest
                  ).toLocaleString()}`,
                  `Remaining Balance: $${yearData.balance.toLocaleString()}`,
                ];
              },
            },
          },
        },
      },
    });
  }

  toggleAmortization(): void {
    this.showAmortization = !this.showAmortization;
  }
}
