import { Component, OnInit, ViewChild } from '@angular/core';
import { Deposito, Stock } from '../../models/model';
import { DepositoService } from '../../services/deposito.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
})
export class StockListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Id', 'Articulo', 'Deposito', 'Cantidad', 'Edit',"ShowMovements"];
  dataSource: MatTableDataSource<Stock>;
  // Estados de visualización
  showList = true;       // Muestra la lista principal de saldos
  showAdjustForm = false; // Muestra el formulario de ajuste
  showMovements = false; // Muestra la lista de movimientos
  addMovements = false; // Muestra la lista de movimientos
  mode: 'ajustar' | 'addMov' |'' = '';
  selectedId: number;
  selectedArticuloId: string;
  selectedDepositoId: string;

  constructor(
    private entityService: StockService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ajustar(id: number): void {
    this.showList = false;
    this.showAdjustForm = true;
    this.showMovements = false;
    this.addMovements = false; 
    this.mode = 'ajustar';
    this.selectedId = id;
  }
  verMovimientos(articuloId: string, depositoId: string) {
    this.selectedArticuloId = articuloId;
    this.selectedDepositoId = depositoId;
    this.showList = false;
    this.showAdjustForm = false;
    this.addMovements = false; 
    this.showMovements = true;
  }
   addMovimientos() {   
    this.showList = false;
    this.showAdjustForm = false;    
    this.showMovements = false;
    this.addMovements = true; 
    this.mode ='addMov';
  }
  updateFromMovStock(): void {
    this.entityService.updateFromMovStock().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.configTable();
      },
      error: err => console.error('Error al cargar empresas', err)
    });
  }
  configTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  closeForm(): void {
    this.showList = true;
    this.showAdjustForm = false;
    this.showMovements = false;
    this.addMovements = false;
    this.mode = '';
    this.configTable();
  }

  loadData(): void {
    this.entityService.findAll().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.configTable();
      },
      error: err => console.error('Error al cargar empresas', err)
    });
  }

  createFilter(): (data: Stock, filter: string) => boolean {
    return (data: Stock, filter: string): boolean => {
      const searchTerms = filter.toLowerCase();
      return (
        data.Articulo.Nombre.toLowerCase().includes(searchTerms) ||
        data.Articulo.Id.toString().includes(searchTerms) ||
        data.Deposito.Nombre.toLowerCase().includes(searchTerms) ||
        data.Cantidad.toString().includes(searchTerms)
      );
    };
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  delete(entity: Stock) {
    if (confirm("Seguro quiere eliminar  " + entity.Articulo.Nombre + "?")) {
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
    this.excelService.exportAsExcelFile(this.dataSource.data, 'stock');
  }

  onItemSaved(event: { action: 'create' | 'update'; data: Stock }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }

}
