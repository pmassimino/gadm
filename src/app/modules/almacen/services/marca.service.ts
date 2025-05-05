import { Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { ConfigService } from '../../../core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { Deposito, Marca } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService extends CrudService<Marca, string> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/almacen/marca/');
  }
}
