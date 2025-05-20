import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { FormAjusteStock, Stock } from '../models/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService extends CrudService<Stock, number> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/almacen/stock/');
  }

  ajustar(entity: FormAjusteStock): Observable<Stock> {
      return this.http.put<Stock>(`${this.base}ajustar`, entity, {}).pipe(
        catchError(this.handleError)
      );
    }
  
  updateFromMovStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.base}updateFromMovStock`).pipe(
      catchError(this.handleError)
    );
  }
}
