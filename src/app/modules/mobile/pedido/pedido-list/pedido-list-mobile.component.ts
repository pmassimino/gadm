import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pedido } from '../../../ventas/models/model';
import { PedidoService } from '../../../ventas/services/pedido.service';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list-mobile.component.html',
  styleUrls: ['./pedido-list-mobile.component.css'],
})
export class PedidoListMobileComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Fecha', 'Estado', 'Numero', 'Cliente', 'Total', 'Actions'];
  dataSource: MatTableDataSource<Pedido>;
  isEdit = false;
  mode: 'list' | 'showActions' | 'changeState' | '' = 'list';

  selectedId: string= "";
  selectedEntity: Pedido;
  totalItems: number;
  total: number;
  @Output() close = new EventEmitter<void>();

  constructor(
    private entityService: PedidoService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  addNew() {
this.router.navigate(["/mobile/pedido"])
  }
  showActions(entity: Pedido): void {
    this.isEdit = true;
    this.mode = 'showActions';
    this.selectedEntity = entity;
  }
  changeState(entity: any): void {
    this.selectedId = entity.data.Id;
    this.isEdit = true;        
    this.mode = 'changeState';
  }

  calcular(): void {
    this.totalItems = 0;
    this.total = 0;
    this.totalItems = this.dataSource.filteredData.reduce((total, item) => total + 1, 0);
    this.dataSource.filteredData.forEach(item => {
      this.total += item.Total;
    });
  }

  closeForm(): void {
    this.isEdit = false;
    this.mode = 'list';
    this.selectedEntity = null;
  }

  loadData(): void {
    this.entityService.findAll().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.calcular();
      },
      error: err => console.error('Error al cargar empresas', err)
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createFilter(): (data: Pedido, filter: string) => boolean {
    return (data: Pedido, filter: string): boolean => {
      const searchTerms = filter.toLowerCase();
      return (
        data.Sujeto.Nombre.toLowerCase().includes(searchTerms) ||
        data.Estado.toLocaleLowerCase().includes(searchTerms)
      );
    };
  }

  delete(entity: Pedido) {
    if (confirm("Seguro quiere eliminar  " + entity.Numero + "?")) {
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

  onItemSaved(event: { action: 'create' | 'update'; data: Pedido }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }
  onChangeState(event: { action: 'create' | 'update'; data: Pedido }): void {
    if (event.action === 'create') {
      this.dataSource.data.push(event.data);
    } else if (event.action === 'update') {
      this.dataSource.data = this.dataSource.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }

}
