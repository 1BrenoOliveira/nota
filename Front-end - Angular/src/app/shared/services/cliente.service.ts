import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Cliente } from '../models/Cliente';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<Cliente>{

  constructor(http: HttpClient) {
    super(http, `http://localhost:8080/cliente`);
   }




}
