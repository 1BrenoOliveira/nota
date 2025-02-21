import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { take, takeLast } from 'rxjs';
import { PageResponse } from '../models/PageResponse';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(protected http: HttpClient,
              @Inject(String)
              private API_URL: string) { }

  listar(){
    return this.http.get<T[]>(this.API_URL)
      .pipe(take(1));
  }

  buscarRegistry(id: number){
    return this.http.get<T>(`${this.API_URL}/${id}`).pipe(take(1));
   }

  criarNovo(registry){
    return this.http.post<T>(this.API_URL, registry, this.httpOptions).pipe(take(1));
  }

  atualizar(registry){
    return this.http.put<T>(`${this.API_URL}/${registry.id}`, registry).pipe(take(1));
  }

  deletar(idRegistry: number){
    return this.http.delete(`${this.API_URL}/${ idRegistry}`).pipe(take(1));
  }

}
