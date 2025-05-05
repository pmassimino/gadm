import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CrudOperations } from './crud-operations.interface';
import { catchError } from 'rxjs/operators';

export interface ApiError {
  campo: string;
  mensaje: string;
}

export abstract class CrudService<T, ID> implements CrudOperations<T, ID> {
  private readonly _Current = new BehaviorSubject<T>(null);
  private readonly _CurrentList = new BehaviorSubject<T[]>(null);

  constructor(
    protected http: HttpClient,
    protected base: string
  ) { }

  // Métodos CRUD con manejo de errores

  newDefault(): Observable<T> {
    return this.http.get<T>(`${this.base}NewDefault/`).pipe(
      catchError(this.handleError)
    );
  }

  add(t: T): Observable<T> {
    return this.http.post<T>(this.base, t).pipe(
      catchError(this.handleError)
    );
  }

  update(id: ID, t: T): Observable<T> {
    return this.http.put<T>(`${this.base}${id}`, t, {}).pipe(
      catchError(this.handleError)
    );
  }

  findOne(id: ID): Observable<T> {
    return this.http.get<T>(`${this.base}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  findByName(name: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}byName/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  findByTransaccion(id: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}byTransaccion/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.base).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: ID): Observable<T> {
    return this.http.delete<T>(`${this.base}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Getters y Setters para el estado actual

  get Current(): T | null {
    return this._Current.getValue();
  }

  set Current(val: T | null) {
    this._Current.next(val);
  }

  get CurrentList(): T[] {
    return this._CurrentList.getValue();
  }

  set CurrentList(val: T[]) {
    this._CurrentList.next(val);
  }

  currentValue(): Observable<T> {
    return this._Current.asObservable();
  }

  // Manejo centralizado de errores
  public handleError = (error: HttpErrorResponse): Observable<never> => {
    if (error.status === 400 && error?.error) {
      const errors: ApiError[] = this.flattenErrors(error.error);
      return throwError(errors);
    }
    const errorMessage = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
  
    return throwError([{ campo: 'general', mensaje: errorMessage } as ApiError]);
  }
  private flattenErrors(errors: Array<[string, string]>): ApiError[] {
    return errors.map(([campo, mensaje]) => ({
      campo,
      mensaje
    } as ApiError));
  }
}