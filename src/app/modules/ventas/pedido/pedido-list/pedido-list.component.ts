import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleFactura, Factura, FacturaPedido, MedioPago, Pedido } from '../../models/model';
import { PedidoService } from '../../services/pedido.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pedido-list',
  templateUrl: './pedido-list.component.html',
  styleUrls: ['./pedido-list.component.css'],
})
export class PedidoListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Fecha', 'Estado','Numero', 'Cliente', 'Total', 'Print','Facturar', 'Delete'];
  dataSource: MatTableDataSource<Pedido>;
  isEdit = false;
  mode: 'new' | 'edit' | '' = '';
  selectedId = '';
  totalItems: number;
  total: number;

  constructor(
    private entityService: PedidoService,
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
  print(id: string) {
    this.entityService.print(id).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
    });
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
    this.mode = '';
    this.selectedId = '';
  }

  loadData(): void {
    this.entityService.findAll().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();        
        this.calcular();},
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
          data.Estado .toLocaleLowerCase().includes(searchTerms)      
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
  generarFacturaDesdePedido(pedido:Pedido) {
  // Crear factura modelo basada en el pedido
  
  const facturaModelo = this.crearFacturaDesdePedido(pedido);
  
  this.router.navigate(['/ventas/factura/add'], {
    state: { facturaModelo } // Pasamos la factura modelo como estado
  });
}

crearFacturaDesdePedido(pedido: Pedido): Factura {
  const factura = new Factura();  
  // Copiar datos del cliente
  factura.Id =  crypto.randomUUID();
  factura.IdEmpresa = "001";
  factura.IdSeccion = "001";
  factura.IdSucursal =  "001",
  factura.IdArea = "001";   
  factura.IdMoneda = "PES";
  factura.CotizacionMoneda =  1;
  factura.IdTransaccion =  crypto.randomUUID();
  factura.IdPuntoEmision =  "00001";
  factura.Letra =  "B";
  factura.IdCuenta = pedido.IdCuenta;  
  factura.Tipo = "1";
  factura.Fecha = new Date().toISOString();
  factura.FechaComp = new Date().toISOString();
  factura.FechaVencimiento = new Date().toISOString();
  factura.TotalDescuento = 0;
  // Convertir items del pedido a items de factura
  factura.Detalle = pedido.Detalle.map(itemPedido => {
    const detalle = new DetalleFactura();
    detalle.IdArticulo = itemPedido.IdArticulo;
    detalle.Concepto = itemPedido.Concepto;
    detalle.Cantidad = itemPedido.Cantidad;
    detalle.Precio = itemPedido.Precio;
    detalle.PorBonificacion = itemPedido.PorBonificacion;
    detalle.Bonificacion = itemPedido.Bonificacion;
    detalle.CondIva = itemPedido.CondIva;
    detalle.Exento = itemPedido.Exento;
    detalle.Gravado = itemPedido.Gravado;
    detalle.NoGravado = itemPedido.NoGravado;
    detalle.Item = itemPedido.Item;    // ... otros campos ...
    return detalle;
  });  
  // Agregar pedido como comprobante asociado
  const facturaPedido = new FacturaPedido();
  facturaPedido.IdPedido = pedido.Id;  
  factura.Pedidos = [facturaPedido];
  //MEDIO PAGO
  let medioPago = new MedioPago();
      medioPago.Id = factura.Id;
      medioPago.IdCuentaMayor = "1111"
      medioPago.Concepto = "CONTADO"
      medioPago.Importe = factura.Total;
   factura.MedioPago.push(medioPago);   
  
  return factura;
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

}
