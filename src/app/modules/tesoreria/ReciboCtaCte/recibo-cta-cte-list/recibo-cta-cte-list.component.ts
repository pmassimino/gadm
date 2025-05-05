import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../core/services/excel.service';
import { ReciboCtaCte } from '../../models/model';
import { ReciboCtaCteService } from '../../services/recibo-cta-cte.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-recibo-cta-cte-list',
  templateUrl: './recibo-cta-cte-list.component.html',
  styleUrls: ['./recibo-cta-cte-list.component.css']
})
export class ReciboCtaCteListComponent implements OnInit {
  //Paginacion
  pageSize = 14; // Número de elementos por página
  currentPage = 1; 
  totalItems = 0;
  dataSource: MatTableDataSource<ReciboCtaCte>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Fecha','Tipo', 'Numero','Cliente','Importe','Edit','Print',"Delete"];
  data: ReciboCtaCte[] = [];
      
    constructor(private entityService:ReciboCtaCteService, private router: Router,private excelService: ExcelService) { }
  
    ngOnInit(): void
      {
        this.onSubmit();
      }
  
    addNew(): void
      {       
        this.router.navigate(['tesoreria/reciboctacte/add']);
      }
      exportToExcel() {
        this.excelService.exportAsExcelFile(this.data, 'ReciboCtaCte');
      }
      configTable() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    onSubmit():void
      {
        this.entityService.findAll()
        .subscribe(res => {this.dataSource = new MatTableDataSource(res);this.configTable(); } ,
        err => {console.log(err) ; });
      }
    print(id:string)
      {
      this.entityService.print(id).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);});
      }  
      findByName(name): void {       
        this.dataSource.filter = name.trim().toLowerCase();       
      }
      delete(entity : ReciboCtaCte){
        if (confirm("Seguro quiere eliminar  " + entity.Pe.toString().padStart(4 ,"0") + "-" + entity.Numero.toString().padStart(8 ,"0")   + "?")) {
          var index = this.data.indexOf(entity);              
          this.entityService.delete(entity.Id)
            .subscribe(res=>this.data.splice(index, 1),
              err => {
                alert("El item no se puede eliminar.");
                // Revert the view back to its original state
               // this.data.splice(index, 0, entity);
              });
        }
      }


}
