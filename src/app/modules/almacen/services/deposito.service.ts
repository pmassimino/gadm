import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { Deposito } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class DepositoService extends CrudService<Deposito, string> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/almacen/deposito/');
  }
}
