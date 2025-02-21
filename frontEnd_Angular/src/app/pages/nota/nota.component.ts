import {ProdutoService} from './../../shared/services/produto.service';
import {Nota} from '../../shared/models/Nota';
import {NotaService} from '../../shared/services/nota.service';
import {ClienteService} from '../../shared/services/cliente.service';
import {Produto} from '../../shared/models/Produto';
import {Cliente} from '../../shared/models/Cliente';
import {DetailNotasComponent} from './detail-notas/detail-notas.component';
import {Item} from '../../shared/models/Item';
import {Component, OnInit} from "@angular/core";


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
    private produtoService: ProdutoService){

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
