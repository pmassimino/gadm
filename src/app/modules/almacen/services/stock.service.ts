import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class StockService extends CrudService<Stock, number> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/almacen/stock/');
  }
}
