import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Deposito, MovStockView, Stock } from '../../models/model';
import { DepositoService } from '../../services/deposito.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MovStockService } from '../../services/mov-stock.service';

@Component({
  selector: 'app-movstock-list',
  templateUrl: './movstock-list.component.html',
  styleUrls: ['./movstock-list.component.css'],
})
export class MovStockListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Fecha', 'Numero', 'Concepto', 'Ingreso', 'Egreso', 'Saldo'];
  dataSource: MatTableDataSource<MovStockView>;
  isEdit = false;
  mode: 'ajustar' | '' = '';
  selectedId: number;
  private _idArticulo: string;
  private _idDeposito: string;

  @Input()
  set idArticulo(value: string) {
    this._idArticulo = value;
    this.checkAndLoad();
  }

  @Input()
  set idDeposito(value: string) {
    this._idDeposito = value;
    this.checkAndLoad();
  }


  constructor(
    private entityService: MovStockService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ajustar(id: number): void {
    this.isEdit = true;
    this.mode = 'ajustar';
    this.selectedId = id;
  }

  configTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  closeForm(): void {
    this.isEdit = false;
    this.mode = '';
    this.configTable();
  }
  private checkAndLoad() {
    if (this._idArticulo && this._idDeposito) {
      this.loadData();
    }
  }
  loadData(): void {
    this.entityService.findByArticuloDeposito(null, null, this._idArticulo, this._idDeposito).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        //this.dataSource.filterPredicate = this.createFilter();
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

    }
  }

  exportToExcel(): void {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'stock');
  }



}
