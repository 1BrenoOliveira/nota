import {Nota} from '../../shared/models/Nota';
import {NotaService} from '../../shared/services/nota.service';
import {ClienteService} from '../../shared/services/cliente.service';
import {Produto} from '../../shared/models/Produto';
import {Cliente} from '../../shared/models/Cliente';
import {DetailNotasComponent} from './detail-notas/detail-notas.component';
import {Item} from '../../shared/models/Item';
import {Component, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DevExtremeModule, DxDataGridModule, DxTabPanelModule, DxTemplateModule} from "devextreme-angular";
import {ProdutoService} from "../../shared/services/produto.service";
import {makeBindingParser} from "@angular/compiler";
import {
  signalModelTransform
} from "@angular/compiler-cli/src/transformers/jit_transforms/initializer_api_transforms/model_function";


@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrl: './nota.component.scss'
})
export class NotaComponent implements OnInit {
  nota: Nota;
  notas: Nota[];
  produtos: Produto[];
  clientes: Cliente[];
  itens: Item[] = [];

  constructor(
    private notaService: NotaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService){

  }

  ngOnInit(): void {
    this.listarTodasAsNotas();
    this.listarClientes();
    this.listarProdutos();
  }

  private listarClientes(){
    this.clienteService.listar().subscribe(dados=>{
      this.clientes = dados;
    })
  }
  private listarProdutos(){
    this.produtoService.listar().subscribe(dados=>{
      this.produtos = dados;
    })
  }

  private listarTodasAsNotas(){
    this.notaService.listar().subscribe(dados=>{
      this.notas = dados;
    })
  }

  adicionarNota(e){
    console.log("Adicionar Nota:")
    console.log(e.data);
  }

  carregarItens(e){
    this.itens = e.data.itens;
  }

  mostrar(e){
    console.log(e);
  }
  testarNota(){
    console.log("Nota: " + this.nota);
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxTabPanelModule,
    DevExtremeModule
  ],
  declarations: [NotaComponent, DetailNotasComponent],
  bootstrap: [NotaComponent]
})
export class NotaModule { }
