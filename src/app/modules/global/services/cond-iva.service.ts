import { Injectable } from '@angular/core';
import { CondIva } from '../models/model';
import { CrudService } from '../../../core/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CondIvaService extends CrudService<CondIva, string> {

  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/global/condIva/');
  }
}
