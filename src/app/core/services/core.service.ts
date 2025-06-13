import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export interface ICoreService {
	validarNumeroDocumento(tipo:string,numero:number): Observable<boolean>;	
}

@Injectable({
  providedIn: 'root'
})
export class CoreService implements ICoreService {
  base:string;
  constructor(
    protected http: HttpClient,
    protected config: ConfigService
  ) {
    this.base = config.data.apiUrl + '/core/'
  }
  
  validarNumeroDocumento(tipo:string,numero:number): Observable<any>{
    let params = new HttpParams();
    params = params.append('tipo', tipo);
    params = params.append('numero',numero.toString());
    return this.http.get(this.base + 'ValidarNumeroDocumento',{params: params}).pipe(catchError(this.handleError));
  }
  
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.message}\nMessage: ${error.message}\Descripcion: ${error.error}`;
    }    
    return throwError(error);
  }
  generateUUID(): string {
    // Retorna un número hexadecimal aleatorio de 4 dígitos
    const s4 = (): string => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    // Formato del UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return (
        s4() +
        s4() +
        '-' +
        s4() +
        '-' +
        '4' +
        s4().substring(1) +
        '-' +
        ((Math.floor(Math.random() * 4) + 8).toString(16)) + // 8, 9, a, o b
        s4().substring(1) +
        '-' +
        s4() +
        s4() +
        s4()
    );
  }

}
