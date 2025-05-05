import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CondIva, Empresa, Localidad, Provincia, TipoDocumento } from '../../models/model';
import { EmpresaService } from '../../services/empresa.service';
import { ProvinciaService } from '../../services/provincia.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { CondIvaService } from '../../services/cond-iva.service';
import { LocalidadService } from '../../services/localidad.service';

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css']
})
export class EmpresaFormComponent {
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
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Empresa }>();

  form: FormGroup;
  entity: Empresa = new Empresa();
  provincias: Provincia[] = [];
  localidades: Localidad[] = [];
  tiposDocumento: TipoDocumento[] = [];
  condicionesIva: CondIva[] = [];
  errors: { campo: string; mensaje: string }[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private condIvaService: CondIvaService,
    private tipoDocumentoService: TipoDocumentoService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
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
      NombreComercial: ['', Validators.required],
      Domicilio: [''],
      Altura: [''],
      IdProvincia: ['', Validators.required],
      IdLocalidad: ['', Validators.required],
      CodigoPostal: ['', Validators.required],
      IdCondicionIva: [''],
      IdTipoDoc: ['', Validators.required],
      NumeroDocumento: ['', { validators: Validators.required, updateOn: 'blur' }],
      Telefono: [''],
      Movil: [''],
      Email1: ['', Validators.email],
      DatabaseName:[''],
    });
  }

  private loadStaticData(): void {
    this.tipoDocumentoService.findAll().subscribe({
      next: res => this.tiposDocumento = res,
      error: err => console.error(err)
    });
    this.condIvaService.findAll().subscribe({
      next: res => this.condicionesIva = res,
      error: err => console.error(err)
    });
    this.provinciaService.findAll().subscribe({
      next: res => this.provincias = res,
      error: err => console.error(err)
    });
  }

  private loadDefaultValues(): void {
    this.empresaService.newDefault().subscribe({
      next: res => {
        this.entity = res;
        this.form.patchValue(this.entity);
      },
      error: err => console.error(err)
    });
  }

  private loadEntity(id: string): void {
    this.empresaService.findOne(id).subscribe({
      next: res => {
        this.entity = res;
        this.form.patchValue(this.entity);
        this.loadLocalidades();
      },
      error: err => console.error(err)
    });
  }

  loadLocalidades(): void {
    const provinciaId = this.form.get('IdProvincia')?.value;
    if (provinciaId) {
      this.localidadService.findByProvincia(provinciaId).subscribe({
        next: res => this.localidades = res,
        error: err => console.error(err)
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const saveAction = this.mode === 'new' 
      ? this.empresaService.add(this.form.value)
      : this.empresaService.update(this.entity.Id, this.form.value);

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

  goBack(): void {
    this.router.navigate(['global/empresa']);
  }

  isValid(): boolean {
    return this.form.valid;
  }
}
