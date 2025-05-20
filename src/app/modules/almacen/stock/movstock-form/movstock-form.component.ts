import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { Articulo, Deposito, Stock } from '../../models/model';
import { MovStockService } from '../../services/mov-stock.service';
import { ArticuloService } from '../../services/articulo.service';
import { DepositoService } from '../../services/deposito.service';

@Component({
  selector: 'app-movstock-form',
  templateUrl: './movstock-form.component.html',
  styleUrl: './movstock-form.component.css'
})
export class MovStockFormComponent {
  @Input() set mode(value: string) { this._mode = value; }
  get mode(): string { return this._mode; }
  private _mode = '';
  // Array con las opciones para el select
  tiposMovimiento = [
    { Id: 1, Nombre: 'Ingreso' },
    { Id: 2, Nombre: 'Egreso' }
  ];
  articulos: Articulo[] = [];
  depositos: Deposito[] = [];

  @Input() set id(value: number) {
    if (value) {
      this._id = value;
      this.loadEntity(value);
    }
  }
  get id(): number { return this._id; }
  private _id: number;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Stock }>();

  form: FormGroup;
  entity: Stock = new Stock();
  errors: { campo: string; mensaje: string }[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private entityService: MovStockService,
    private articuloService: ArticuloService,
    private depositoService: DepositoService,
    private stockService :StockService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadStaticData();
    this.initForm();
    if (!this.id) this.loadDefaultValues();
  }

  private initForm(): void {
    this.form = this.fb.group({      
        Id: [0],  // No es requerido si se genera automáticamente
        Fecha: [new Date().toISOString().split('T')[0], Validators.required],
        Tipo: [1, Validators.required],
        IdArticulo: ['', Validators.required],
        IdDeposito: ['001', Validators.required],
        Concepto: ['', Validators.required],
        Numero: ['', Validators.required],
        IdLote: [0],  // Opcional (si no es obligatorio)
        IdSerie: [0], // Opcional (si no es obligatorio)
        Cantidad: [0, [Validators.required, Validators.min(0)]],      
    });
  }

  private loadStaticData(): void {
    this.articuloService.findAll().subscribe(
      res => this.articulos = res,
      err => console.error('Error:', err)
    );
    this.depositoService.findAll().subscribe(
      res => this.depositos = res,
      err => console.error('Error:', err)
    );
  }

  private loadDefaultValues(): void {

  }

  private loadEntity(id: number): void {
    
  }



  save(): void {
    if (this.form.invalid) return;
    const saveAction = this.entityService.add(this.form.value);
    saveAction.subscribe({
      next: data => {
        const action = 'create';
        this.saved.emit({ action, data });
        this.submitted = true;
      },
      error: err => {
        console.log(err);
        this.errors = Array.isArray(err) ? err : [{ campo: 'general', mensaje: 'Error inesperado' }];
      }
    });
  }

  onSubmit(): void {
    this.save();
  }

  onClose(): void {
    this.close.emit();
  }
  onChangeArticulo(id: string) {
    this.form.get('IdArticulo')?.setValue(id);
  }
  isValid(): boolean {
    return this.form.valid;
  }

}
