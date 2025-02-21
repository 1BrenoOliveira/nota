import { Item } from "./Item";
import { Cliente } from "./Cliente";

export class Nota{

  id: number;

  cliente: Cliente;

  dataEmisao: string;

  valorTotal: number;

  itens: Item[];

}
