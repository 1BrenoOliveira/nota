import { ProdutoService } from './../../shared/services/produto.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DxNumberBoxModule } from "devextreme-angular"
import { Produto } from '../../shared/models/Produto';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{


  produtos: Produto[];

  constructor(private produtoService: ProdutoService){

  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe(dados =>{
     this.produtos = dados;
    })
  }

  adicionarProduto(e){
    this.produtoService.criarNovo(e.data).subscribe(dados=>{
      var tamanho = (this.produtos.length) - 1;
      this.produtos[tamanho].id = dados.id;
    });
  }
  removerProduto(e){
    this.produtoService.deletar(e.data.id).subscribe();
  }
  atualizarProduto(e){
    this.produtoService.atualizar(e.data).subscribe();
  }

}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxNumberBoxModule
  ],
  declarations: [ProdutoComponent],
  bootstrap: [ProdutoComponent]
})
export class ProdutoModule { }
