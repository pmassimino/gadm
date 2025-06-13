import { EventEmitter, Injectable } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { Pedido, UpdateEstadoDto } from '../models/model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../../core/services/config.service';
import { Observable } from 'rxjs';
import { NumeradorDocumento } from '../../comun/models/model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends CrudService<Pedido,string> {

  selectEvent = new EventEmitter<Pedido[]>();
  constructor(protected http: HttpClient, protected config: ConfigService) {
    super(http, config.data.apiUrl + '/ventas/pedido/');
  }
  public DigitosDecimal:number=2;
  print(id: string): Observable<any>
   {    
    return this.http.get(this.base + id + "/print",{ responseType: "blob" });
   }
   letrasDisponible(idCondIva:string): Observable<any>
   {
     let params = new HttpParams();
     params = params.append('idCondIva', idCondIva);    
     return this.http.get(this.base  + "letrasdisponibles",{params:params});
   }
   nextNumber(idSeccion:string,letra:string,tipo:string): Observable<NumeradorDocumento>
   {
     let params = new HttpParams();
     params = params.append('idSeccion', idSeccion);    
     params = params.append('letra', letra);    
     params = params.append('tipo', tipo);    
     return this.http.get<NumeradorDocumento>(this.base  + "nextNumber",{params:params});
   }
   
  
   listView(fecha:string,fechaHasta:string): Observable<Pedido[]> {
    let params = new HttpParams();            
    params = params.append('fecha', fecha);
    params = params.append('fechaHasta',fechaHasta);     
    return this.http.get<Pedido[]>(this.base + "listview",{params: params});
  }
  findByIdCuenta(idCuenta:string): Observable<Pedido[]> {   
    const url = this.base + "ByCuenta/" + idCuenta;
    return this.http.get<Pedido[]>(url);
  }
  select(data: Pedido[]) {
   this.selectEvent.emit(data);
  }
  updateEstado(id: string, entity: UpdateEstadoDto): Observable<Pedido> {
      return this.http.post<Pedido>(`${this.base}${id}/estado`, entity, {}).pipe(
        catchError(this.handleError)
      );
    }

}
