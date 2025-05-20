import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormAjusteStock, MovStock, MovStockView, Stock } from '../models/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovStockService extends CrudService<MovStock, number> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/almacen/movstock/');
  }
  
  findByArticuloDeposito(fecha:string,fechaHasta:string,idArticulo,idDeposito): Observable<MovStockView[]> {
    let params = new HttpParams();        
        params = params.append('fecha', fecha);
        params = params.append('fechaHasta',fechaHasta);   
        const url = this.base + idArticulo+"/"+idDeposito;     
        return this.http.get<MovStockView[]>(url).pipe(
      catchError(this.handleError)
    );;
     
  }
}
