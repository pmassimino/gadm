import { Component, OnInit, ViewChild } from '@angular/core';
import { Marca } from '../../models/model';
import { MarcaService } from '../../services/marca.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-marca-list',
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css'],
})
export class MarcaListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Id', 'Nombre', 'Edit', 'Delete'];
  dataSource: MatTableDataSource<Marca>;
  isEdit = false;
  mode: 'new' | 'edit' | '' = '';
  selectedId = '';

  constructor(
    private entityService: MarcaService,
    private excelService: ExcelService,
    private router: Router
  ) { }

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
      next: res => this.dataSource = new MatTableDataSource(res),
      error: err => console.error('Error al cargar empresas', err)
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  delete(entity: Marca) {
    if (!confirm(`¿Eliminar ${entity.Nombre}?`)) return;
    const index = this.dataSource.data.findIndex(item => item.Id === entity.Id);
    if (index > -1) {
      // Crear un nuevo array para que Angular detecte el cambio
      const newData = [...this.dataSource.data];
      newData.splice(index, 1);
      this.dataSource.data = newData;
      this.entityService.delete(entity.Id).subscribe({
        error: () => {
          // Revertir la operación si falla
          const revertedData = [...this.dataSource.data];
          revertedData.splice(index, 0, entity);
          this.dataSource.data = revertedData;
          alert("No se pudo eliminar");
        }
      });
    }
  }
  
  exportToExcel(): void {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'empresas');
  }

  onItemSaved(event: { action: 'create' | 'update'; data: Marca }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }

}
