import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sujeto, TipoRolSujeto, TipoRol } from '../../models/model';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors, UntypedFormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { SujetoService } from '../../services/sujeto.service';

import { Router, ActivatedRoute } from '@angular/router';
import { TipoDocumentoService } from '../../../global/services/tipo-documento.service';
import { TipoDocumento, CondIva, Provincia, Localidad } from '../../../global/models/model';
import { CoreService } from '../../../../core/services/core.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CondIvaService } from '../../../global/services/cond-iva.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { ProvinciaService } from '../../../global/services/provincia.service';
import { LocalidadService } from '../../../global/services/localidad.service';
import { TipoRolService } from '../../services/tuipo-rol.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-sujeto-form',
  templateUrl: './sujeto-form.component.html',
  styleUrls: ['./sujeto-form.component.css']
})
export class SujetoFormComponent implements OnInit {


  form: UntypedFormGroup;
  entity: Sujeto = new Sujeto();
  tipoDocumento: TipoDocumento[] = [];
  provincia: Provincia[] = [];
  localidad: Localidad[] = [];
  condIva: CondIva[] = [];
  matcher = new MyErrorStateMatcher();

  errors = [];
  _mode = "";
  @Output() close = new EventEmitter<void>(); // Evento para notificar al padre
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Sujeto }>();

  submitted = false;
  @Input() set mode(value: string) {
    this._mode = value;
    if (this.mode == "new") {
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
  _id: string;
  get f() { return this.form.controls; }

  constructor(private entityService: SujetoService, tipoRolService: TipoRolService, private coreService: CoreService,
    private tipoDocumentoService: TipoDocumentoService, private condIvaService: CondIvaService,
    private provinciaService: ProvinciaService, private localidadService: LocalidadService,
    private router: Router, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder) {

  }


  ngOnInit(): void {
    this.popupData();
    

    this.createForm();
    
  }

  createForm(): void {
    this.form = new UntypedFormGroup({
      Id: new UntypedFormControl(this.entity.Id, Validators.required),
      Nombre: new UntypedFormControl(this.entity.Nombre, Validators.required),
      NombreComercial: new UntypedFormControl(this.entity.NombreComercial, Validators.required),
      Domicilio: new UntypedFormControl(this.entity.Domicilio),
      Altura: new UntypedFormControl(this.entity.Altura),
      IdProvincia: new UntypedFormControl(this.entity.IdProvincia, Validators.required),
      IdLocalidad: new UntypedFormControl(this.entity.IdLocalidad, Validators.required),
      CodigoPostal: new UntypedFormControl(this.entity.CodigoPostal),
      IdCondicionIva: new UntypedFormControl(this.entity.IdCondicionIva),
      IdTipoDoc: new UntypedFormControl(this.entity.IdTipoDoc, { validators: Validators.required }),
      NumeroDocumento: new UntypedFormControl(this.entity.NumeroDocumento, { validators: Validators.required, updateOn: 'blur' }),
      Email1: new UntypedFormControl(this.entity.Email1, Validators.email),
      TipoRolSujeto: new UntypedFormArray([this.createItem()])
    });
  }

  popupData(): void {
    this.tipoDocumentoService.findAll().subscribe(res => { this.tipoDocumento = res; }, err => { console.log(err); });
    this.condIvaService.findAll().subscribe(res => { this.condIva = res; }, err => { console.log(err); });
    this.provinciaService.findAll().subscribe(res => { this.provincia = res; }, err => { console.log(err); });
  }
  setDefaultValues(): void {
    this.entityService.newDefault().subscribe(res => { this.entity = res; this.createForm(); }, err => { console.log(err); });
    //this.addRolSujeto();
  }
  getById(id): void {
    this.entityService.findOne(id).subscribe(res => { this.entity = res, this.createForm(); this.getLocalidadByProvincia(); });
  }
  onNombreChanged() {
    if (this.form.get("NombreComercial").value != "") {
      let nombre = this.form.get("Nombre");
      this.form.get("NombreComercial").patchValue(nombre);
    }
  }

  createItem(): UntypedFormGroup {
    let rol = new TipoRolSujeto("1", this.entity.Id);
    this.entity.TipoRolSujeto.push(rol);
    return this.formBuilder.group({
      idTipoRol: rol.IdTipoRol,
      idSujeto: this.entity.Id
    });
  }

  getLocalidadByProvincia(): void {
    this.localidadService.findByProvincia(this.form.get("IdProvincia").value).subscribe(res => { this.localidad = res });
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

  isValid():boolean
  {
    return this.form.valid
  }

  


  private numeroDocumentoValidator(control: UntypedFormControl): Observable<ValidationErrors | null> {
    let numeroDocumento = this.form.get("NumeroDocumento").value;
    let idTipoDoc = this.form.get("IdTipoDoc").value;
    return this.coreService.validarNumeroDocumento(idTipoDoc, numeroDocumento).pipe(
      map(notValid => (notValid == false ? { numeroDocumentoNoValido: true } : null)),
      catchError(() => of(null))
    );
  }


}
