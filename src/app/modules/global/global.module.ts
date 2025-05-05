import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaSelectComponent } from './empresa/empresa-select/empresa-select.component';
import { GlobalRoutingModule } from './global-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EmpresaListComponent } from './empresa/empresa-list/empresa-list.component';
import { EmpresaFormComponent } from './empresa/empresa-form/empresa-form.component';



@NgModule({
  declarations: [EmpresaSelectComponent,EmpresaListComponent,EmpresaFormComponent],
  imports: [
    CommonModule,
    GlobalRoutingModule,    
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
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GlobalModule { }
