import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../ventas/services/pedido.service';
import { SujetoService } from '../../../comun/services/sujeto.service';
import { Sujeto } from '../../../comun/models/model';
import { ArticuloService } from '../../../almacen/services/articulo.service';
import { Articulo } from '../../../almacen/models/model';
import { DetallePedido } from '../../../ventas/models/model';




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
  clientes: Sujeto[] = [];
  productos: Articulo[]=[];

  //productos: Producto[] = [
  // { id: 1, codigo: "PROD-001", descripcion: "Producto Uno", precio: 100, stock: 50 },
  //  { id: 2, codigo: "PROD-002", descripcion: "Producto Dos", precio: 200, stock: 30 },
  //  { id: 3, codigo: "PROD-003", descripcion: "Producto Tres", precio: 150, stock: 40 }
  //];

  // Variables del formulario
  clienteSeleccionado: Sujeto | null = null;
  productoSeleccionado: Articulo | null = null;
  cantidad: number = 1;
  observaciones: string = '';
  
  // Lista de productos en el pedido
  itemsPedido: ItemPedido[] = [];

  // Totales
  subtotal: number = 0;
  porcentajeImpuesto: number = 16; // 16% de IVA
  impuestos: number = 0;
  total: number = 0;

  constructor(private entityService: PedidoService,private  sujetoService:SujetoService,
    private articuloService:ArticuloService){}

  ngOnInit(): void {
    this.loadStaticData();
    this.calcularTotales();
  }
  private loadStaticData(): void
   {
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
    const itemExistente = this.itemsPedido.find(item => item.productoId === this.productoSeleccionado!.Id);
    
    if (itemExistente) {
      // Actualizar cantidad si ya existe
      itemExistente.cantidad += this.cantidad;
    } else {
      // Agregar nuevo item
      this.itemsPedido.push({
        productoId: this.productoSeleccionado.Id,        
        codigo: this.productoSeleccionado.Id,
        Nombre: this.productoSeleccionado.Nombre,
        precio: this.productoSeleccionado.PrecioVentaFinal,
        cantidad: this.cantidad        
      });
    }

    // Resetear selección
    this.productoSeleccionado = null;
    this.cantidad = 1;
    
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
    this.subtotal = this.itemsPedido.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    this.impuestos = this.subtotal * (this.porcentajeImpuesto / 100);
    this.total = this.subtotal + this.impuestos;
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
    const pedido = {
      cliente: this.clienteSeleccionado,
      items: this.itemsPedido,
      observaciones: this.observaciones,
      subtotal: this.subtotal,
      impuestos: this.impuestos,
      total: this.total,
      fecha: new Date()
    };

    console.log('Pedido a guardar:', pedido);
    alert('Pedido guardado exitosamente');
    
    // Resetear formulario
    this.resetearFormulario();
  }

  // Resetear formulario
  resetearFormulario(): void {
    this.clienteSeleccionado = null;
    this.itemsPedido = [];
    this.observaciones = '';
    this.calcularTotales();
  }
}