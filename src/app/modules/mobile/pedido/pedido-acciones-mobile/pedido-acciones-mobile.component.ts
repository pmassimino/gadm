import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pedido } from '../../../ventas/models/model';
import { Router } from '@angular/router';
import { PedidoService } from '../../../ventas/services/pedido.service';

@Component({
  selector: 'app-pedido-acciones-mobile',
  templateUrl: './pedido-acciones-mobile.component.html',
  styleUrls: ['./pedido-acciones-mobile.component.css']
})
export class PedidoAccionesMobileComponent {
  @Input() pedido: Pedido | null = null;
  @Input() pedidoId: string | null = null;
  @Output() onNuevoPedido = new EventEmitter<void>();
  @Output() onListarPedidos = new EventEmitter<void>();
  
  mostrarOpciones = false;
  compartiendo = false;

  constructor(
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  toggleOpciones() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  imprimir() {
    const id = this.pedidoId || this.pedido?.Id;
    if (!id) return;
    
    this.pedidoService.print(id).subscribe((resultBlob: Blob) => {
      const downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
    });
  }

  async compartir() {
    const id = this.pedidoId || this.pedido?.Id;
    if (!id) return;

    this.compartiendo = true;
    
    try {
      const blob = await this.pedidoService.print(id).toPromise();
      
      if (navigator.share) {
        // Para dispositivos móviles con Web Share API
        const file = new File([blob], `pedido_${id}.pdf`, { type: 'application/pdf' });
        
        await navigator.share({
          title: `Pedido ${id}`,
          text: `Compartiendo el pedido ${id}`,
          files: [file]
        });
      } else {
        // Fallback para navegadores sin Web Share API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedido_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    } finally {
      this.compartiendo = false;
      this.mostrarOpciones = false;
    }
  }

  nuevoPedido() {
    this.onNuevoPedido.emit();
    this.router.navigate(['/pedidos/nuevo']);
  }

  listarPedidos() {
    this.onListarPedidos.emit();
    this.router.navigate(['/pedidos']);
  }
}