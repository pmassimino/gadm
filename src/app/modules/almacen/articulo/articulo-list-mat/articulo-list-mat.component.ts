import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { Articulo } from '../../models/model';
import { ArticuloService } from '../../services/articulo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from '../../../../core/services/excel.service';

@Component({
  selector: 'app-articulo-list-mat',
  templateUrl: './articulo-list-mat.component.html',
  styleUrls: ['./articulo-list-mat.component.css']
})
export class ArticuloListMatComponent implements OnInit {
  
  dataSource: MatTableDataSource<Articulo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Id', 'Nombre', 'PrecioVentaFinal', 'Edit', 'Delete'];
  isEdit: boolean = false;
  selectedId: string = "";
  mode: 'new' | 'edit' | '' = '';
  constructor(private entityService: ArticuloService, private router: Router, private route: ActivatedRoute, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.getAll();
  }

  configTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAll(): void {
    this.entityService.findAll()
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res);        
        this.configTable();
      },
        err => { console.log(err); });

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
  onItemSaved(event: { action: 'create' | 'update'; data: Articulo }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }

  delete(entity: Articulo) {
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
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'articulos');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
