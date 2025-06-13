import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ArticuloFormComponent } from './articulo/articulo-form/articulo-form.component';
import { AuthGuard } from '../../core/services/auth.guard';
import { FamiliaListComponent } from './familia/familia-list/familia-list.component';
import { FamiliaFormComponent } from './familia/familia-form/familia-form.component';
import { DepositoListComponent } from './deposito/deposito-list/deposito-list.component';
import { MarcaListComponent } from './marca/marca-list/marca-list.component';
import { ArticuloListLayoutComponent } from './articulo/articulo-list-layout/articulo-list-layout.component';
import { StockListLayoutComponent } from './stock/stock-list-layout/stock-list-layout.component';


const routes: Routes = [  
  { path: 'articulo', component: ArticuloListLayoutComponent ,canActivate: [AuthGuard],data:{permiso:"Almacen.Articulo.GetAll",reuseRoute: true}},   
  { path: 'articulo/add', component: ArticuloFormComponent,canActivate: [AuthGuard] },  
  { path: 'articulo/:id', component: ArticuloFormComponent,canActivate: [AuthGuard],data:{permiso:"Almacen.Articulo.Add"} },
  { path: 'familia', component: FamiliaListComponent ,canActivate: [AuthGuard]},
  { path: 'familia/add', component: FamiliaFormComponent,canActivate: [AuthGuard] },
  { path: 'familia/:id', component: FamiliaFormComponent ,outlet:'edit',canActivate: [AuthGuard]},
  { path: 'deposito', component: DepositoListComponent ,canActivate: [AuthGuard]},
  { path: 'marca', component: MarcaListComponent ,canActivate: [AuthGuard]},
  { path: 'stock', component: StockListLayoutComponent ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule {}
//{ path: 'articulo/:id', component: ArticuloFormComponent ,canActivate: [AuthGuard],data:{permiso:"Almacen.Articulo.GetAll"}}