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
  @Input() entity: Pedido | null = null;
  @Output() onAddNew = new EventEmitter<void>();
  @Output() onList = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeState = new EventEmitter<{ data: Pedido }>();
  mostrarOpciones = false;
  compartiendo = false;

  constructor(
    private router: Router,
    private entityService: PedidoService
  ) { }

  toggleOpciones() {
    this.mostrarOpciones = !this.mostrarOpciones;
  }

  imprimir() {
    const id = this.entity?.Id;
    if (!id) return;
    this.entityService.print(id).subscribe((resultBlob: Blob) => {
      const downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
    });
  }

  async compartir() {
    const id = this.entity?.Id;
    if (!id) return;

    this.compartiendo = true;

    try {
      const blob = await this.entityService.print(id).toPromise();

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

  addNew() {
    this.onAddNew.emit();
  }

  list() {
    this.onList.emit();
  }
  close(): void {
    this.onClose.emit();
  }
  changeState() {
    this.onChangeState.emit({ data: this.entity });
  }

}