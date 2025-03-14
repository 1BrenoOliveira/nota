import { ProdutoService } from './../../shared/services/produto.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DxNumberBoxModule } from "devextreme-angular"
import { Produto } from '../../shared/models/Produto';
import {catchError, throwError} from "rxjs";
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{


  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService){

  }

  ngOnInit(): void {
    this.produtoService.listar().subscribe(dados =>{
     this.produtos = dados;
    });
  }

  adicionarProduto(e){
    this.produtoService.criarNovo(e.data).subscribe(dados=>{
      var tamanho = (this.produtos.length) - 1;
      this.produtos[tamanho].id = dados.id;
    });
  }
  removerProduto(event){
    let produto: Produto = event.data
    this.produtoService.deletar(event.data.id)
      .pipe(
        catchError((error)=>{
          this.produtos.push(produto);
          let message: string;
          if(error.error.cause.sqlstate == 23503){ // erro de constraint
            message = "Não é possivel excluir este produto, porque ele está vinculado a uma nota";
          }
          else message = "Não é possivel realizar está operação no momento. Tente mais tarde!";
          notify(message, "error", 3000);
          return throwError(() => new Error(message));
        })
      )
      .subscribe();
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
