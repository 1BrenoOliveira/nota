
import { Component, NgModule, OnInit } from '@angular/core';
import { Cliente } from '../../shared/models/Cliente';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { ClienteService } from '../../shared/services/cliente.service';
import {catchError, throwError} from "rxjs";
import {MessageDetailsModule} from "../../shared/components/message-details/message-details.component";
import notify from "devextreme/ui/notify";


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor( private clienteService: ClienteService ){ }

  ngOnInit(): void {
    this.listar();
  }

  listar(){
    this.clienteService.listar().subscribe(dados=> {
      this.clientes = dados;
    });
  }

  adicionarCliente(e){
    this.clienteService.criarNovo(e.data).subscribe(dados => {
      var tamanho = (this.clientes.length) - 1;
      this.clientes[tamanho].id = dados.id;
    });
  }

  removerCliente(event){
    let cliente: Cliente = event.data
    this.clienteService.deletar(event.data.id)
      .pipe(
        catchError((error)=>{
          this.clientes.push(cliente);
          let message;
          if(error.error.cause.sqlstate == 23503){ // erro de constraint
            message = "Não é possivel excluir este cliente, porque ele está vinculado a uma nota";
          }
          else message = "Não é possivel realizar está operação no momento. Tente mais tarde!";
          notify(message, "error", 3000);
          return throwError(() => new Error(message));
        })
      )
      .subscribe();
  }

  atualizarCliente(e){
    this.clienteService.atualizar(e.data).subscribe();
  }

}


@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    MessageDetailsModule,
  ],
  declarations: [ClienteComponent],
  bootstrap: [ClienteComponent],
})
export class ClienteModule { }

