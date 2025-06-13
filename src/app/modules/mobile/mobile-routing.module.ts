import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileDashboardComponent } from './mobile-dashboard/mobile-dashboard.component';
import { AuthGuard } from '../../core/services/auth.guard';
import { SujetoListLayoutMobileComponent } from './sujeto/sujeto-list-layout-mobile/sujeto-list-layout-mobile.component';
import { StockListLayoutMobileComponent } from './stock/stock-list-layout-mobile/stock-list-layout-mobile.component';
import { ArticuloListLayoutMobileComponent } from './articulo/articulo-list-layout-mobile/articulo-list-layout-mobile.component';
import { PedidoFormMobileComponent } from './pedido/pedido-form-mobile/pedido-form-mobile.component';
import { PedidoListMobileComponent } from './pedido/pedido-list/pedido-list-mobile.component';

const routes: Routes = [ 
  { path: '', component: MobileDashboardComponent ,canActivate: [AuthGuard]},
  { path: 'articulos', component: ArticuloListLayoutMobileComponent ,canActivate: [AuthGuard]},
  { path: 'stock', component: StockListLayoutMobileComponent ,canActivate: [AuthGuard]},
  { path: 'clientes', component: SujetoListLayoutMobileComponent ,canActivate: [AuthGuard]},  
  { path: 'pedido', component: PedidoFormMobileComponent ,canActivate: [AuthGuard]},  
  { path: 'pedidos', component: PedidoListMobileComponent ,canActivate: [AuthGuard]},  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
