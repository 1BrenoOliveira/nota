import { Item } from "./Item";
import { Cliente } from "./Cliente";

export class Nota{
  id: number;
  head_id: number =  0;
  cliente: Cliente;
  dataEmisao: string;
  valorTotal: number;
  itens: Item[];

}
