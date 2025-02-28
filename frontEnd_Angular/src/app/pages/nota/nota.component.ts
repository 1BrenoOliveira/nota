import {Nota} from '../../shared/models/Nota';
import {NotaService} from '../../shared/services/nota.service';
import {ClienteService} from '../../shared/services/cliente.service';
import {Produto} from '../../shared/models/Produto';
import {Cliente} from '../../shared/models/Cliente';
import {Component, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import { DevExtremeModule,  DxDataGridModule, DxTabPanelModule, DxTemplateModule, DxToastModule } from "devextreme-angular";
import {ProdutoService} from "../../shared/services/produto.service";
import {MessageDetailsModule} from "../../shared/components/message-details/message-details.component";



@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrl: './nota.component.scss'
})
export class NotaComponent implements OnInit {
  isErroItensVisible = false;

  nota: Nota;

  notas: Nota[] = [];
  produtos: Produto[];
  clientes: Cliente[];

  constructor(
    private notaService: NotaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService
  ){}

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

  private listarTodasAsNotas() {
    this.notaService.listar().subscribe(dados => {
      this.notas = dados;
    })
  }

  salvarRegistro(event){
    if(event.changes[0]){
      switch (event.changes[0].type){
        case 'insert':
        {
          this.adicionarNota(event);
          break;
        }
        case 'update':
        {
          this.atualizarNota(event);
          break;
        }
        case 'remove':
        {
          this.excluirRegistro(event);
          break;
        }
      }
    }
  }
  private excluirRegistro(event){
    if(event.changes[0]){
      this.notaService.deletar(event.changes[0].key).subscribe();
    }
  }

  private adicionarNota(event){
    if(event.changes[0]){
      let nota = event.changes[0].data;
      nota.id = null;
      this.notaService.criarNovo(nota).subscribe(dados=>{
        var tamanho = (this.notas.length) - 1;
        this.notas[tamanho].id = dados.id;
        this.notas[tamanho].valorTotal = dados.valorTotal;
      })
    }
  }

   private atualizarNota(event){
    if(event.changes[0]) {
      let nota = event.changes[0].data;
      this.notaService.atualizar(nota).subscribe();
    }
    console.log("Atualizar Nota:")
     console.log(event.changes[0].data);
  }

   adicionarItem(event, data){
    this.isErroItensVisible = false;
    let valorTotalItem =  this.calcularTotalItem(event);

    if(data.data && data.data.valorTotal) data.data.valorTotal += valorTotalItem;
    else data.data.valorTotal = valorTotalItem;
  }

  removerItem(event, data){
    data.data.valorTotal -= event.data.valorTotalItem;
  }


  setValorNoForm(event: any, data) {
    data.setValue(event);
  }

  iniciarItens(event: any) {
    event.data.itens = [];
  }

  ocultarErroItens(event){
    this.isErroItensVisible = !(event);
  }

   private calcularTotalItem(event){
    let item = event.data;
    let valorTotalItem =  item.produto.valorUnitario * item.quantidade;
    event.data.valorTotalItem = valorTotalItem;
    return valorTotalItem;
  }

  validarNotaPossuiItem(event){
    if(event.changes[0] && event.changes[0].data && event.changes[0].data.itens && event.changes[0].data.itens.length == 0 ) {
      this.isErroItensVisible = true;
      event.cancel = true;
    }
  }

  cancelarEdicaoNota(event){
    if(event.changes[0]) {
      if (event.changes[0].type == 'insert') return;
      else this.validarNotaPossuiItem(event);
    }
/*
    console.log(this.nota);
    event.changes = [{
      data: this.nota,
      key: this.nota.id,
      type: 'update'
    }];

    let idNota = this.nota.id;
    for(let nota of this.notas){
      if(nota.id==idNota) {
        console.log("Nota:" + nota.id);
        nota = this.nota;
      }
    }*/


  }


  registrarEstadoNota(event) {
    this.nota = event.data;
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxTabPanelModule,
    DevExtremeModule,
    DxToastModule,
    MessageDetailsModule
  ],
  declarations: [NotaComponent],
  bootstrap: [NotaComponent]
})
export class NotaModule { }
