import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmacenRoutingModule } from './almacen-routing.module';
import {ArticuloService} from './services/articulo.service';
import { SharedModule } from '../../shared/shared.module';
import { ArticuloFormComponent } from './articulo/articulo-form/articulo-form.component';
import { ArticuloListComponent } from './articulo/articulo-list/articulo-list.component';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from "@angular/material/dialog";
import { FamiliaListComponent } from './familia/familia-list/familia-list.component';
import { ArticuloSelectComponent } from './articulo/articulo-select/articulo-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import {MatTableModule} from '@angular/material/table';
import {NgxPaginationModule } from 'ngx-pagination';
import {ArticuloListMatComponent } from './articulo/articulo-list-mat/articulo-list-mat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FamiliaFormComponent } from './familia/familia-form/familia-form.component';
import { EntitySelectComponent } from '../../shared/entity-select/entity-select.component';
import { DepositoListComponent } from './deposito/deposito-list/deposito-list.component';
import { DepositoFormComponent } from './deposito/deposito-form/deposito-form.component';
import { MarcaFormComponent } from './marca/marca-form/marca-form.component';
import { MarcaListComponent } from './marca/marca-list/marca-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StockListComponent } from './stock/stock-list/stock-list.component';

@NgModule({
    declarations: [ArticuloFormComponent, ArticuloListComponent,
        FamiliaListComponent,  ArticuloSelectComponent, ArticuloListMatComponent,FamiliaFormComponent,
        DepositoListComponent,DepositoFormComponent,MarcaListComponent,MarcaFormComponent,StockListComponent],
    imports: [
        CommonModule,
        AlmacenRoutingModule,
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
        NgxPaginationModule,
        EntitySelectComponent    
    ],
    providers: [
        ArticuloService
    ],
    exports: [ArticuloSelectComponent]
})
export class AlmacenModule { }
