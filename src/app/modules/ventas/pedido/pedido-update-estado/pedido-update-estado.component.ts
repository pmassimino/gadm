import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from '../../models/model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-update-estado',
  templateUrl: './pedido-update-estado.component.html',
  styleUrls: ['./pedido-update-estado.component.css']
})
export class PedidoUpdateEstadoComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'update' = 'update';
  @Input() id: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Pedido }>();

  form: FormGroup = this.fb.group({
    Estado: ['', Validators.required],
    Comentario: [''],
  });

  entity: Pedido = new Pedido();
  estadosDisponibles: string[] = [];
  errors: { campo: string; mensaje: string }[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.loadStaticData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.loadEntity(this.id);
    }
  }

  private loadStaticData(): void {
    // Aquí podrías cargar catálogos si los hubiera
  }

  private loadEntity(id: string): void {
    this.pedidoService.findOne(id).subscribe({
      next: pedido => {
        this.entity = pedido;
        //this.form.patchValue(pedido);
        this.estadosDisponibles = this.getEstadosDisponibles(pedido.Estado);
      },
      error: err => console.error('Error al cargar pedido:', err)
    });
  }

  private getEstadosDisponibles(estadoActual: string): string[] {
    const estadosMap: { [key: string]: string[] } = {
      'PENDIENTE': ['CANCELADO'],
      'CANCELADO': ['PENDIENTE'],
      'FACTURADO': ['EN_PREPARACION', 'ENVIADO', 'ENTREGADO'],
      'EN_PREPARACION': ['ENVIADO', 'ENTREGADO'],
      'ENVIADO': ['ENTREGADO'],
      'ENTREGADO': ['DEVUELTO']
    };
    return estadosMap[estadoActual] || [];
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const payload = this.form.value;
    this.pedidoService.updateEstado(this.entity.Id, payload).subscribe({
      next: updated => {
        this.submitted = true;
        this.saved.emit({ action: 'update', data: updated });
      },
      error: err => {
        console.error('Error al actualizar:', err);
        this.errors = Array.isArray(err)
          ? err
          : [{ campo: 'general', mensaje: 'Error inesperado' }];
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
  isValid():boolean
  {
    return this.form.valid;
  }
}
