import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LayoutEntityComponent } from '../../../../shared/layout-entity/layout-entity.component';
import { Familia } from '../../models/model';
import { FamiliaService } from '../../services/familia.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../core/services/excel.service';
import { FamiliaFormComponent } from '../familia-form/familia-form.component';

@Component({
  selector: 'app-familia-list',
  templateUrl: './familia-list.component.html',
  styleUrls: ['./familia-list.component.css']
})
export class FamiliaListComponent implements OnInit {
  @ViewChild('tabs') tabsComponent!: LayoutEntityComponent;
  data: Familia[] = [];
  isEdit: boolean = false;
  selectedId:string = "";
  mode: 'new' | 'edit' | '' = '';

  @Output() itemSelected = new EventEmitter<any>();
  constructor(private entityService: FamiliaService, private router: Router, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.getAll();
  }

 
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.data, 'familia');
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
  getAll(): void {
    this.entityService.findAll()
      .subscribe(res => { this.data = res; },
        err => { console.log(err); });
  }
  findByName(name): void {
    this.entityService.findByName(name)
      .subscribe(res => { this.data = res; console.log(this.data); }, err => { console.log(err); });
  }
  
  onItemSaved(event: { action: 'create' | 'update'; data: Familia }): void {
      if (event.action === 'create') {
        this.data.push(event.data);
      } else if (event.action === 'update') {
        this.data = this.data.map(e => e.Id === event.data.Id ? event.data : e);
      }
      this.closeForm();
    }

  delete(entity) {
    if (confirm("Seguro quiere eleminar  " + entity.nombre + "?")) {
      var index = this.data.indexOf(entity);
      this.data.splice(index, 1);
      this.entityService.delete(entity.Id)
        .subscribe(null,
          err => {
            alert("El item no se puede eliminar.");
            // Revert the view back to its original state
            this.data.splice(index, 0, entity);
          });
    }
  }

}
