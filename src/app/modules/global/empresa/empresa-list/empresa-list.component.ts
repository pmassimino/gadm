import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from '../../models/model';
import { EmpresaService } from '../../services/empresa.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { LayoutEntityComponent } from '../../../../shared/layout-entity/layout-entity.component';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {
  @ViewChild('tabs') tabsComponent!: LayoutEntityComponent;
  @Output() itemSelected = new EventEmitter<any>();

  data: Empresa[] = [];
  isEdit = false;
  mode: 'new' | 'edit' | '' = '';
  selectedId = '';

  constructor(
    private empresaService: EmpresaService,
    private excelService: ExcelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  addNew(): void {
    this.isEdit = true;
    this.mode = 'new';
    this.selectedId = '';
  }

  edit(id: string): void {
    this.isEdit = true;
    this.mode = 'edit';
    this.selectedId = id;
  }

  closeForm(): void {
    this.isEdit = false;
    this.mode = '';
    this.selectedId = '';
  }

  loadData(): void {
    this.empresaService.findAll().subscribe({
      next: res => this.data = res,
      error: err => console.error('Error al cargar empresas', err)
    });
  }

  findByName(name: string): void {
    if (!name.trim()) {
      this.loadData();
      return;
    }

    this.empresaService.findByName(name).subscribe({
      next: res => this.data = res,
      error: err => console.error('Error al buscar empresas', err)
    });
  }

  delete(entity: Empresa): void {
    if (confirm(`¿Seguro quiere eliminar a ${entity.Nombre}?`)) {
      const index = this.data.indexOf(entity);
      this.data.splice(index, 1);
      this.empresaService.delete(entity.Id).subscribe({
        error: () => {
          alert('El item no se puede eliminar.');
          this.data.splice(index, 0, entity); // Revertir si falla
        }
      });
    }
  }

  exportToExcel(): void {
    this.excelService.exportAsExcelFile(this.data, 'empresas');
  }

  onItemSaved(event: { action: 'create' | 'update'; data: Empresa }): void {
    if (event.action === 'create') {
      this.data.push(event.data);
    } else if (event.action === 'update') {
      this.data = this.data.map(e => e.Id === event.data.Id ? event.data : e);
    }
    this.closeForm();
  }
}
