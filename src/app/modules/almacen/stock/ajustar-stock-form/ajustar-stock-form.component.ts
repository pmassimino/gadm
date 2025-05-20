import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../models/model';

@Component({
  selector: 'app-ajustar-stock-form',  
  templateUrl: './ajustar-stock-form.component.html',
  styleUrl: './ajustar-stock-form.component.css'
})
export class AjustarStockFormComponent {
  @Input() set mode(value: string) { this._mode = value; }
    get mode(): string { return this._mode; }
    private _mode = '';
  
    @Input() set id(value: number) {
      if (value) {
        this._id = value;
        this.loadEntity(value);
      }
    }
    get id(): number { return this._id; }
    private _id :number  ;
  
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Stock }>();
  
    form: FormGroup;
    entity: Stock = new Stock();    
    errors: { campo: string; mensaje: string }[] = [];
    submitted = false;
  
    constructor(
      private fb: FormBuilder,
      private entityService: StockService,
      private router: Router,
      private route: ActivatedRoute
    ) {}
  
    ngOnInit(): void {
      this.loadStaticData();
      this.initForm();
      if (!this.id) this.loadDefaultValues();
    }
  
    private initForm(): void {
      this.form = this.fb.group({
        Stock: this.fb.group({
          Id: [null],  // No es requerido si se genera automáticamente
          IdArticulo: ['', Validators.required],
          IdDeposito: ['', Validators.required],
          IdLote: [null],  // Opcional (si no es obligatorio)
          IdSerie: [null], // Opcional (si no es obligatorio)
          Cantidad: [0, [Validators.required, Validators.min(0)]],         
        }),
        Fecha: ['', Validators.required],  // Validación de formato opcional (ej: fecha ISO)
        Concepto: ['', [Validators.required, Validators.maxLength(60)]],
        Cantidad: [0, [Validators.required, Validators.min(0)]],  // Cantidad del ajuste
      });
    }
  
    private loadStaticData(): void {
     
    }
  
    private loadDefaultValues(): void {
      
    }
  
    private loadEntity(id: number): void {
      this.entityService.findOne(id).subscribe({
        next: res => {
          this.entity = res;
          this.form.patchValue({
            Stock: {
              Id: this.entity.Id,
              IdArticulo: this.entity.IdArticulo,
              IdDeposito: this.entity.IdDeposito,
              IdLote: this.entity.IdLote,
              IdSerie: this.entity.IdSerie,
              Cantidad: 0,             
            }});  
            this.form.patchValue({
              Fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
              Concepto: 'Ajuste de stock manual', // Valor por defecto
              Cantidad: 0, // Inicializa en 0 (ajustable)
            });     
        },
        error: err => console.error(err)
      });
    }
  
   
  
    save(): void {
      if (this.form.invalid) return;  
      const saveAction =  this.entityService.ajustar(this.form.value);  
      saveAction.subscribe({
        next: data => {
          const action = 'update';
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
  
    isValid(): boolean {
      return this.form.valid;
    }

}
