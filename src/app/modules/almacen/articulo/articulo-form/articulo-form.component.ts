import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo, Familia, Marca } from '../../models/model';
import { Router, ActivatedRoute } from '@angular/router';
import { FamiliaService } from '../../services/familia.service';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { CondIvaOperacion, UnidadMedida } from '../../../global/models/model';
import { CondIvaOperacionService } from '../../../global/services/cond-iva-operacion.service';
import { UnidadMedidaService } from '../../../global/services/unidad-medida.service';
import { MarcaService } from '../../services/marca.service';

@Component({
  selector: 'app-articulo-form',
  templateUrl: './articulo-form.component.html',
  styleUrls: ['./articulo-form.component.css']
})
export class ArticuloFormComponent implements OnInit {
  form: UntypedFormGroup;
  entity: Articulo = new Articulo();
  condIva: CondIvaOperacion[] = [];
  familia: Familia[] = [];
  marca: Marca[] = [];
  unidadMedida: UnidadMedida[] = []
  submitted = false;
  errors = [];
  _mode = "";
  @Output() close = new EventEmitter<void>(); // Evento para notificar al padre
  @Output() saved = new EventEmitter<{ action: 'create' | 'update'; data: Articulo }>();

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
  constructor(private entityService: ArticuloService, private condIvaOpService: CondIvaOperacionService,
    private familiaService: FamiliaService,private marcaService:MarcaService,
    private unidadMedidaService: UnidadMedidaService,
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
      IdFamilia: new UntypedFormControl(this.entity.IdFamilia),
      IdMarca: new UntypedFormControl(this.entity.IdMarca),
      IdUnidad: new UntypedFormControl(this.entity.IdUnidad),
      EsServicio: new UntypedFormControl(this.entity.EsServicio),
      CostoVenta: new UntypedFormControl(this.entity.CostoVenta),
      ImpuestoVenta: new UntypedFormControl(this.entity.ImpuestoVenta),
      CondIva: new UntypedFormControl(this.entity.CondIva),
      AlicuotaIva: new UntypedFormControl(this.entity.AlicuotaIva),
      MargenVenta: new UntypedFormControl(this.entity.MargenVenta),
      PrecioVenta: new UntypedFormControl(this.entity.PrecioVenta),
      PrecioVentaFinal: new UntypedFormControl(this.entity.PrecioVentaFinal)
    });
    this.calculate();
  }

  popupData(): void {
    this.condIvaOpService.findAll()
      .subscribe(res => { this.condIva = res; }, err => { console.log(err); });
    this.familiaService.findAll().subscribe(res => { this.familia = res; }, err => { console.log(err); });
    this.marcaService.findAll().subscribe(res => { this.marca = res; }, err => { console.log(err); });
    this.unidadMedidaService.findAll().subscribe(res => { this.unidadMedida = res; }, err => { console.log(err); });

  }
  setDefaultValues(): void {
    this.entityService.newDefault().subscribe(res => { this.entity = res; this.createForm(); }, err => { console.log(err); });

  }
  getById(id): void {
    this.entityService.findOne(id).subscribe(res => { this.entity = res; this.createForm(); });
  }
  new(): void {
    this.submitted = false;
  }
  condIvaChange(args) {
    let alicuotaIva = this.condIva.find(x => x.Id === this.form.get("CondIva").value).Alicuota;
    this.form.get("AlicuotaIva").patchValue(alicuotaIva);
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

  calculate(): void {
    this.form.valueChanges.subscribe(val => {
      const newPrecioVenta = ((val.CostoVenta * val.MargenVenta / 100) + val.CostoVenta);
      const newPrecioVentaFinal = (((newPrecioVenta - val.ImpuestoVenta) * val.AlicuotaIva / 100) + newPrecioVenta + val.ImpuestoVenta);
      this.form.controls.PrecioVenta.patchValue(newPrecioVenta, { emitEvent: false });
      this.form.controls.PrecioVentaFinal.patchValue(newPrecioVentaFinal, { emitEvent: false });
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

}
