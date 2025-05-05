import { Component, OnInit } from '@angular/core';
import { SujetoService } from '../../services/sujeto.service';
import { Router } from '@angular/router';
import { Sujeto } from '../../models/model';
import { ExcelService } from '../../../../core/services/excel.service';

@Component({
  selector: 'app-sujeto-list',
  templateUrl: './sujeto-list.component.html',
  styleUrls: ['./sujeto-list.component.css']
})
export class SujetoListComponent implements OnInit {

  data: Sujeto[] = [];
  isEdit: boolean = false;
  selectedId:string = "";
  mode: 'new' | 'edit' | '' = '';
    
  constructor(private entityService: SujetoService, private router: Router,private excelService: ExcelService) { }

  ngOnInit(): void
    {
      this.getAll();
    }

  
    exportToExcel() {
      this.excelService.exportAsExcelFile(this.data, 'sujeto');
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
  getAll():void
    {
      this.entityService.findAll()
      .subscribe(res => {this.data = res; } ,
      err => {console.log(err) ; });
    }
    findByName(name): void {       
      this.entityService.findByName(name)
     .subscribe(res => {this.data = res; console.log(this.data); } , err => {console.log(err) ; });
    }
    delete(entity){
      if (confirm("Seguro quiere eliminar  " + entity.nombre + "?")) {
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
    onItemSaved(event: { action: 'create' | 'update'; data: Sujeto }): void {
          if (event.action === 'create') {
            this.data.push(event.data);
          } else if (event.action === 'update') {
            this.data = this.data.map(e => e.Id === event.data.Id ? event.data : e);
          }
          this.closeForm();
        }
    

}
