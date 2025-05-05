import { Component, OnInit, ViewChild } from '@angular/core';
import { Deposito } from '../../models/model';
import { DepositoService } from '../../services/deposito.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-deposito-list',
  templateUrl: './deposito-list.component.html',
  styleUrls: ['./deposito-list.component.css'],  
})
export class DepositoListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['Id', 'Nombre', 'Edit', 'Delete'];
    dataSource: MatTableDataSource<Deposito>;
    isEdit = false;
    mode: 'new' | 'edit' | '' = '';
    selectedId = '';
  
    constructor(
      private entityService: DepositoService,
      private excelService: ExcelService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.loadData();
    }
  
    addNew(): void {
      this.isEdit = true;
      this.mode = 'new';
      this.selectedId = '';
    }
  
    edit(id: string): void {
      this.isEdit = true;
      this.mode = 'edit';
      this.selectedId = id;
    }
  
    closeForm(): void {
      this.isEdit = false;
      this.mode = '';
      this.selectedId = '';
    }
  
    loadData(): void {
      this.entityService.findAll().subscribe({
        next: res =>  this.dataSource = new MatTableDataSource(res),
        error: err => console.error('Error al cargar empresas', err)
      });
    }
  
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
  
    delete(entity:Deposito) {
      if (confirm("Seguro quiere eliminar  " + entity.Nombre + "?")) {
        var index = this.dataSource.filteredData.indexOf(entity);
        this.dataSource.filteredData.splice(index, 1);
        this.entityService.delete(entity.Id)
          .subscribe(null,
            err => {
              alert("El item no se puede eliminar.");
              // Revert the view back to its original state
              this.dataSource.filteredData.splice(index, 0, entity);
            });
      }
    }
  
    exportToExcel(): void {
      this.excelService.exportAsExcelFile(this.dataSource.data, 'empresas');
    }
  
    onItemSaved(event: { action: 'create' | 'update'; data: Deposito }): void {
      if (event.action === 'create') {
        this.dataSource.data.push(event.data);
      } else if (event.action === 'update') {
        this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
      }
      this.closeForm();
    }

}
