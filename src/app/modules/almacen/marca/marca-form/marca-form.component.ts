import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marca } from '../../models/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaService } from '../../services/marca.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-marca-form',  
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent {
  @Input() set mode(value: string) { this._mode = value; }
    get mode(): string { return this._mode; }
    private _mode = '';
  
    @Input() set id(value: string) {
      if (value) {
        this._id = value;
        this.loadEntity(value);
      }
    }
    get id(): string { return this._id; }
    private _id = '';
  
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Marca }>();
  
    form: FormGroup;
    entity: Marca = new Marca();    
    errors: { campo: string; mensaje: string }[] = [];
    submitted = false;
  
    constructor(
      private fb: FormBuilder,
      private entityService: MarcaService,
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
        Id: ['', Validators.required],
        Nombre: ['', Validators.required],       
      });
    }
  
    private loadStaticData(): void {
     
    }
  
    private loadDefaultValues(): void {
      this.entityService.newDefault().subscribe({
        next: res => {
          this.entity = res;
          this.form.patchValue(this.entity);
        },
        error: err => console.error(err)
      });
    }
  
    private loadEntity(id: string): void {
      this.entityService.findOne(id).subscribe({
        next: res => {
          this.entity = res;
          this.form.patchValue(this.entity);        
        },
        error: err => console.error(err)
      });
    }
  
   
  
    save(): void {
      if (this.form.invalid) return;
  
      const saveAction = this.mode === 'new' 
        ? this.entityService.add(this.form.value)
        : this.entityService.update(this.entity.Id, this.form.value);
  
      saveAction.subscribe({
        next: data => {
          const action = this.mode === 'new' ? 'create' : 'update';
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
