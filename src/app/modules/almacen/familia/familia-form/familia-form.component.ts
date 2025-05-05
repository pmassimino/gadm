import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, UntypedFormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FamiliaService } from '../../services/familia.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Familia } from '../../models/model';
import { CuentaMayorService } from '../../../contable/services/cuenta-mayor.service';
import { CuentaMayor } from '../../../contable/models/model';
import { EntitySelectComponent } from '../../../../shared/entity-select/entity-select.component';
import { EntitySelectView } from '../../../../shared/models/model';


@Component({
  selector: 'app-familia-form',
  templateUrl: './familia-form.component.html',
  styleUrls: ['./familia-form.component.css']
})
export class FamiliaFormComponent implements OnInit {

  form: UntypedFormGroup;
  entity: Familia = new Familia();
  cuentaMayor: EntitySelectView[] = [];
  errors = [];
  _mode = "";
  @Output() close = new EventEmitter<void>(); // Evento para notificar al padre
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Familia }>();

  submitted = false;
  @Input() set mode(value: string) 
  { 
    this._mode = value;
    if (this.mode=="new")
      {
        this.setDefaultValues();
      }
  }
  get mode(): string { return this._mode; }
 

  @Input()
  set id(value: string) {
    this._id = value;
    this.getById(this._id);      
  }

  get id(): string {
    return this._id; // Devuelve el valor interno de id
  }
  _id : string;

  constructor(private entityService: FamiliaService,
    private cuentaMayorService: CuentaMayorService,
    private router: Router, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder) {

  }

  ngOnInit(): void {
    this.popupData();        
    this.createForm();   
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      Id: [this.entity.Id, Validators.required],
      Nombre: [this.entity.Nombre, Validators.required],
      CtaIngresoDefault: [this.entity.CtaIngresoDefault],
      CtaEgresoDefault: [this.entity.CtaEgresoDefault]
    });

  }

  popupData(): void {
    this.cuentaMayorService.findImputables().subscribe(res => {
      // Suponiendo que res es un array de CuentasMayor
      this.cuentaMayor = res.map(cuentaMayor => {
        return {
          Id: cuentaMayor.Id,           // Aquí usas los campos de CuentasMayor para mapear a EntitySelectView
          Nombre: cuentaMayor.Nombre,
          Selected: false               // Inicialmente 'Selected' es false, pero puedes ajustarlo según tus necesidades
        };
      });
    });
  }

  setDefaultValues(): void {
    this.entityService.newDefault().subscribe(res => { this.entity = res; this.createForm(); }, err => { console.log(err); });
  }
  getById(id): void {
    this.entityService.findOne(id).subscribe(res => { this.entity = res, this.createForm(); });
  }
  new(): void {
    this.submitted = false;
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


  onSubmit() {
    this.save();
  }

  onClose() {
    this.close.emit();
  }

  goBack() {
    this.router.navigate(['almacen/familia/list']);
  }
  onChangeCtaIngreso(id: string) {
    this.form.get('CtaIngresoDefault')?.setValue(id);
  }
  onChangeCtaEgreso(id: string) {
    this.form.get('CtaEgresoDefault')?.setValue(id);
  }
  isValid(): boolean {
    return this.form.valid
  }

  


}
