
import { Component, NgModule, OnInit } from '@angular/core';
import { Cliente } from '../../shared/models/Cliente';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { ClienteService } from '../../shared/services/cliente.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[];


  constructor(private clienteService: ClienteService){ }

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

  removerCliente(e){
    this.clienteService.deletar(e.data.id).subscribe();
  }

  atualizarCliente(e){
    this.clienteService.atualizar(e.data).subscribe();
  }



}


@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
  ],
  declarations: [ClienteComponent],
  bootstrap: [ClienteComponent],
})
export class ClienteModule { }

