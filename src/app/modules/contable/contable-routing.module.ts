import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthGuard } from '../../core/services/auth.guard';

import { CuentaMayorListComponent } from './cuentamayor/cuenta-mayor-list/cuenta-mayor-list.component';
import { CuentaMayorFormComponent } from './cuentamayor/cuenta-mayor-form/cuenta-mayor-form.component';
import { MayorListComponent } from './mayor/mayor-list/mayor-list.component';
import { ResumenSaldoListComponent } from './ctacte/resumen-saldo-list/resumen-saldo-list.component';
import { ResumenComponent } from './ctacte/resumen/resumen.component';
import { TestComponent } from './ctacte/test/test.component';
import { LibroIvaListComponent } from './libroiva/libro-iva-list/libro-iva-list.component';
import { AsientoFormComponent } from './asiento/asiento-form/asiento-form.component';
import { MayorBalanceComponent } from './mayor/mayor-balance/mayor-balance.component';
import { MayorListViewComponent } from './mayor/mayor-list-view/mayor-list-view.component';


const routes: Routes = [
  { path: 'cuentamayor/list', component: CuentaMayorListComponent ,canActivate: [AuthGuard]},
  { path: 'cuentamayor/add', component: CuentaMayorFormComponent ,canActivate: [AuthGuard]},
  { path: 'cuentamayor/:id', component: CuentaMayorFormComponent ,canActivate: [AuthGuard]},  
  { path: 'mayor/list', component: MayorListComponent ,canActivate: [AuthGuard]},
  { path: 'mayor/listview', component: MayorListViewComponent ,canActivate: [AuthGuard]},
  { path: 'mayor/balance', component: MayorBalanceComponent ,canActivate: [AuthGuard]},
  { path: 'mayor/add', component: AsientoFormComponent ,canActivate: [AuthGuard]},
  { path: 'mayor/:id', component: AsientoFormComponent ,canActivate: [AuthGuard]},
  { path: 'ctacte/test', component: TestComponent},
  { path: 'ctacte/list', component: ResumenSaldoListComponent ,canActivate: [AuthGuard]},
  { path: 'ctacte/resumen/:id', component: ResumenComponent ,canActivate: [AuthGuard]},
  { path: 'libroiva/list', component: LibroIvaListComponent ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContableRoutingModule {}
