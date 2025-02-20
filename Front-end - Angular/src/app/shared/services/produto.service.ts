import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Produto } from '../models/Produto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends CrudService<Produto> {

  constructor(http: HttpClient) {
    super(http, "http://localhost:8080/produto");
   }
}
