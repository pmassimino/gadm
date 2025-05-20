import { Component, OnInit, ViewChild } from '@angular/core';
import { SujetoService } from '../../services/sujeto.service';
import { Router } from '@angular/router';
import { Sujeto } from '../../models/model';
import { ExcelService } from '../../../../core/services/excel.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sujeto-list',
  templateUrl: './sujeto-list.component.html',
  styleUrls: ['./sujeto-list.component.css']
})
export class SujetoListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Id', 'Nombre', 'Edit', 'Delete'];
  dataSource: MatTableDataSource<Sujeto>;
  isEdit = false;
  mode: 'new' | 'edit' | '' = '';
  selectedId = '';


  constructor(private entityService: SujetoService, private router: Router, private excelService: ExcelService) { }

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

  delete(entity: Sujeto) {
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

  onItemSaved(event: { action: 'create' | 'update'; data: Sujeto }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }

}
