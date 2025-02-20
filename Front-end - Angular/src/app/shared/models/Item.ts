import { Produto } from "./Produto";

export class Item{
  id: number;
  head_id: number =  1;
  sequencial: string;
  produto: Produto;
  quantidade: number;
  valorTotalItem: number;
}
