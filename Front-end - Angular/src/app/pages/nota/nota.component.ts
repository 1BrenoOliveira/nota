import { ProdutoService } from './../../shared/services/produto.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import {  DxDataGridModule, DxTabPanelModule, DxTemplateModule } from 'devextreme-angular';
import { Nota } from '../../shared/models/Nota';
import { NotaService } from '../../shared/services/nota.service';
import { ClienteService } from '../../shared/services/cliente.service';
import { Produto } from '../../shared/models/Produto';
import { Cliente } from '../../shared/models/Cliente';
import { DetailNotasComponent } from './detail-notas/detail-notas.component';
import { Item } from '../../shared/models/Item';


@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrl: './nota.component.scss'
})
export class NotaComponent implements OnInit {

  notas: Nota[];
  produtos: Produto[];
  clientes: Cliente[];
  itens: Item[] = [];

  constructor(
    private notaService: NotaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
  ){

  }

  ngOnInit(): void {
    this.listarTodasAsNotas();
    this.listarClientes();
    this.listarProdutos();
  }

  carregarItens(e){
    this.notaService.buscarRegistry(e.data.id).subscribe(dados=>{
      this.itens = dados.itens;
      console.log(this.itens);
    })
  }

  private listarClientes(){
    this.clienteService.listar().subscribe(dados=>{
      this.clientes = dados.content;
    })
  }
  private listarProdutos(){
    this.produtoService.listar().subscribe(dados=>{
      this.produtos = dados.content;
    })
  }

  private listarTodasAsNotas(){
    this.notaService.listar().subscribe(dados=>{
      for(let nota of dados.content){
        let data = nota.dataEmissao;
        nota.head_id = 0;
        nota.dataEmissao = new Date(data.substring(6,10), (data.substring(3,5))-1, data.substring(0,2) );
        for( let item of nota.itens) {
          item.head_id = nota.id;
        }
      }
      this.notas = dados.content;
    })
  }

  adicionarNota(e){
    console.log(e.data);
  }



}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxTabPanelModule
  ],
  declarations: [NotaComponent, DetailNotasComponent],
  bootstrap: [NotaComponent]
})
export class NotaModule { }
