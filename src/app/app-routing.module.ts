import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateBorrowComponent } from './calculate-borrow/calculate-borrow.component';
import { CalculateRepaymentComponent } from './calculate-repayment/calculate-repayment.component';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';

const routes: Routes = [
  { path: 'borrowCalculator', component: CalculateBorrowComponent },
  { path: 'repaymentCalculator', component: CalculateRepaymentComponent },
  { path: 'loanCalculator', component: LoanCalculatorComponent },
  { path: '', redirectTo: '/items', pathMatch: 'full' }, // Optional: Redirect to items by default
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
