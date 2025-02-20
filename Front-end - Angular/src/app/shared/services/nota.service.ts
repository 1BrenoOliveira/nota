import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Nota } from '../models/Nota';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService extends CrudService<Nota> {



  constructor(http: HttpClient) {
    super(http, "http://localhost:8080/nota");
   }


}
