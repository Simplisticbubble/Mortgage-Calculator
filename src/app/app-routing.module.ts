import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateBorrowComponent } from './calculate-borrow/calculate-borrow.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  { path: 'calculate', component: CalculateBorrowComponent },
  { path: 'clients', component: ClientsComponent },
  { path: '', redirectTo: '/calculate', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
