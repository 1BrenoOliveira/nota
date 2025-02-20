import { Component, Input, OnInit } from '@angular/core';
import { NotaService } from '../../../shared/services/nota.service';
import { Item } from 'devextreme/ui/tree_view';

@Component({
  selector: 'app-detail-notas',
  templateUrl: './detail-notas.component.html',
  styleUrl: './detail-notas.component.scss'
})
export class DetailNotasComponent implements OnInit{ //implements AfterViewInit {
  @Input() key: number;
  itens: Item[];

  constructor(private notaService: NotaService){

  }
  ngOnInit(): void {
    this.notaService.buscarRegistry(this.key).subscribe(dados => {
      this.itens = dados.itens;
    })
  }



}
