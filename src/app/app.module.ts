import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Add this import
import { AppComponent } from './app.component';
import { CalculateBorrowComponent } from './calculate-borrow/calculate-borrow.component';
import { ClientsComponent } from './clients/clients.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalculateRepaymentComponent } from './calculate-repayment/calculate-repayment.component';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';

@NgModule({
  declarations: [AppComponent, CalculateBorrowComponent, ClientsComponent, CalculateRepaymentComponent, LoanCalculatorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule, // Add this line (must be after BrowserModule)
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
