import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileRoutingModule } from './mobile-routing.module';
import { Routes } from '@angular/router';
import { MobileDashboardComponent } from './mobile-dashboard/mobile-dashboard.component';
import { AuthGuard } from '../../core/services/auth.guard';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlmacenModule } from '../almacen/almacen.module';
import { SujetoListLayoutMobileComponent } from './sujeto/sujeto-list-layout-mobile/sujeto-list-layout-mobile.component';
import { ComunModule } from '../comun/comun.module';
import { StockListLayoutMobileComponent } from './stock/stock-list-layout-mobile/stock-list-layout-mobile.component';
import { ArticuloListLayoutMobileComponent } from './articulo/articulo-list-layout-mobile/articulo-list-layout-mobile.component';
import { PedidoFormMobileComponent } from './pedido/pedido-form-mobile/pedido-form-mobile.component';
import { PedidoAccionesMobileComponent } from './pedido/pedido-acciones-mobile/pedido-acciones-mobile.component';


@NgModule({
  declarations: [MobileDashboardComponent,ArticuloListLayoutMobileComponent,
    StockListLayoutMobileComponent,SujetoListLayoutMobileComponent,PedidoFormMobileComponent,PedidoAccionesMobileComponent],
  imports: [
    CommonModule,
    MobileRoutingModule, 
    CommonModule,
    ComunModule,
    AlmacenModule,
    SharedModule,
    FormsModule,    
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxPaginationModule
  ]
})
export class MobileModule { }
