import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../ventas/services/pedido.service';
import { SujetoService } from '../../../comun/services/sujeto.service';
import { Sujeto } from '../../../comun/models/model';
import { ArticuloService } from '../../../almacen/services/articulo.service';
import { Articulo } from '../../../almacen/models/model';
import { DetallePedido, Pedido } from '../../../ventas/models/model';
import { CondIvaService } from '../../../global/services/cond-iva.service';
import { CondIva, CondIvaOperacion } from '../../../global/models/model';
import { CondIvaOperacionService } from '../../../global/services/cond-iva-operacion.service';
import { CoreService } from '../../../../core/services/core.service';
import { Router } from '@angular/router';




interface ItemPedido {
  productoId: string;
  codigo: string;
  Nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-pedido-form-mobile',
  templateUrl: './pedido-form-mobile.component.html',
  styleUrls: ['./pedido-form-mobile.component.css']
})
export class PedidoFormMobileComponent implements OnInit {
  mode: 'new' | 'showActions' | '' = 'new';
  clientes: Sujeto[] = [];
  idPedido: string = "";
  pedido: Pedido = null;
  productos: Articulo[] = [];
  // Variables del formulario
  clienteSeleccionado: Sujeto | null = null;
  productoSeleccionado: Articulo | null = null;
  cantidad: number = 1;
  porBonificacion: number = 0;
  observaciones: string = '';
  condIva: CondIvaOperacion[] = [];

  // Lista de productos en el pedido
  itemsPedido: DetallePedido[] = [];

  // Totales
  subtotal: number = 0;
  porcentajeImpuesto: number = 0; // 
  impuestos: number = 0;
  total: number = 0;
  totalItems: number = 0;

  constructor(private entityService: PedidoService, private sujetoService: SujetoService,
    private articuloService: ArticuloService, private condIvaService: CondIvaOperacionService,
    private coreService: CoreService, private router: Router,) { }

  ngOnInit(): void {
    this.loadStaticData();
    this.calcularTotales();
  }
  private loadStaticData(): void {
    this.sujetoService.findAll().subscribe({
      next: res => {
        this.clientes = res;
        //this.form.patchValue(this.entity);
      },
      error: err => console.error(err)
    });
    this.articuloService.findAll().subscribe({
      next: res => {
        this.productos = res;
        //this.form.patchValue(this.entity);
      },
      error: err => console.error(err)
    });
    this.condIvaService.findAll().subscribe(res => this.condIva = res);
  }

  // Seleccionar cliente
  seleccionarCliente(event: any): void {
    const clienteId = event.target.value;
    this.clienteSeleccionado = this.clientes.find(c => c.Id === clienteId) || null;
  }

  // Seleccionar producto
  seleccionarProducto(event: any): void {
    const productoId = event.target.value;
    this.productoSeleccionado = this.productos.find(p => p.Id === productoId) || null;
  }

  // Agregar producto al pedido
  agregarProducto(): void {
    if (!this.productoSeleccionado || this.cantidad <= 0) return;

    // Verificar si el producto ya está en el pedido
    const itemExistente = this.itemsPedido.find(item => item.IdArticulo === this.productoSeleccionado!.Id);
    //Totales

    if (itemExistente) {
      // Actualizar cantidad si ya existe
      itemExistente.Cantidad += this.cantidad;
    } else {
      // Agregar nuevo item

      this.itemsPedido.push({
        Id: '',
        Item: 0,
        IdArticulo: this.productoSeleccionado.Id,
        IdUnidadMedida: '',
        Cantidad: this.cantidad,
        Concepto: this.productoSeleccionado.Nombre,
        Precio: this.productoSeleccionado.PrecioVenta,
        PorBonificacion: this.porBonificacion,
        Bonificacion: 0,
        Gravado: this.productoSeleccionado.PrecioVenta,
        CondIva: this.productoSeleccionado.CondIva,
        Iva: 0,
        NoGravado: 0,
        Exento: 0,
        OtroTributo: 0,
        Total: 0,
        Lote: '',
        Serie: '',
        Articulo: null,
        Pedido: null
      });
    }

    // Resetear selección
    this.productoSeleccionado = null;
    this.cantidad = 1;
    this.porBonificacion = 0;

    // Actualizar totales
    this.calcularTotales();
  }

  // Eliminar producto del pedido
  eliminarProducto(index: number): void {
    this.itemsPedido.splice(index, 1);
    this.calcularTotales();
  }
  // Calcular totales  
  calcularTotales(): void {
    let totalNoGravado = 0;
    let totalExento = 0;
    let totalGravado = 0;
    let total = 0;
    let totalIva = 0;
    let totalItems = 0;
    let totalOTributos = 0;
    for (let item of this.itemsPedido) {

      let tmpCondIva = this.condIva.find(w => w.Id == item.CondIva);
      //Bonificacion
      let cantidad = item.Cantidad;
      let precio = item.Precio;
      let impuestoVenta = 0
      let porBonificacion = item.PorBonificacion;
      let bonificacion = cantidad * precio * porBonificacion / 100;
      let subTotal = cantidad * precio - bonificacion;
      let subTotalImpuesto = cantidad * impuestoVenta;
      let gravado = 0;
      let noGravado = 0;
      let exento = 0;


      if (tmpCondIva.Id == "001")//No Gravado
      {
        noGravado = subTotal;
      }
      else if (tmpCondIva.Id == "002")//Exento
      {
        exento = subTotal;
      }
      else //Gravado
      {
        gravado = subTotal;
      }
      //iva
      let iva = gravado * tmpCondIva.Alicuota / 100;
      totalNoGravado += noGravado;
      totalExento += exento;
      totalGravado += gravado;
      totalOTributos += subTotalImpuesto;
      totalIva += iva;
      totalItems += 1;
      item.Bonificacion = bonificacion;
      item.Iva = iva;
      item.Total = subTotal;

    }

    let totalNeto = totalNoGravado + totalExento + totalGravado;
    this.subtotal = totalNeto;
    this.impuestos = totalIva + totalOTributos;
    this.total = totalNeto + totalOTributos + totalIva;
    this.totalItems = this.itemsPedido.length;

  }

  // Guardar pedido
  guardarPedido(): void {
    if (!this.clienteSeleccionado) {
      alert('Por favor seleccione un cliente');
      return;
    }

    if (this.itemsPedido.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    // Aquí iría la lógica para guardar el pedido


    const Id = this.coreService.generateUUID();
    const IdTransaccion = this.coreService.generateUUID();
    this.itemsPedido.forEach(element => {
      element.Id = Id;
    });
    const pedido: Pedido = {
      Id: Id,
      IdSucursal: '',
      IdArea: '001',
      IdSeccion: '003',
      IdTransaccion: IdTransaccion,
      Tipo: '1',
      Letra: 'X',
      IdPuntoEmision: '',
      Pe: 0,
      Numero: 0,
      Fecha: new Date().toISOString(),
      FechaComp: new Date().toISOString(),
      FechaEntrega: new Date().toISOString(),
      FechaVencimiento: new Date().toISOString(),
      IdMoneda: '',
      CotizacionMoneda: 0,
      Origen: 'PEDIDO',
      IdCuenta: this.clienteSeleccionado.Id,
      TotalNeto: 0,
      PorDescuento: 0,
      TotalDescuento: 0,
      Total: this.total,
      TotalExento: 0,
      TotalGravado: 0,
      TotalNoGravado: 0,
      TotalIva: 0,
      TotalOTributos: 0,
      Obs: this.observaciones,
      CreadoPor: '',
      Estado: 'PENDIENTE',
      Sujeto: null,
      Detalle: this.itemsPedido,
      Iva: [],
      Estados: []
    };
    this.entityService.add(pedido).
      subscribe(res => {
        this.idPedido = res.Id;
        this.pedido = res;
        this.mode = "showActions"
      });
    console.log('Pedido a guardar:', pedido);
    // Resetear formulario
    this.resetearFormulario();
  }

  // Resetear formulario
  resetearFormulario(): void {
    this.clienteSeleccionado = null;
    this.productoSeleccionado = null;
    this.itemsPedido = [];
    this.observaciones = '';
    this.calcularTotales();
    this.mode = "new"
  }
  list(): void {
    this.router.navigate(["/mobile/pedidos"])
  }

}

