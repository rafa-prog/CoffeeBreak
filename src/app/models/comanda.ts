import { Produto } from "./produto"

export interface Comanda {
  id: string
  mesa: number
  produtos: Produto[]
  quantidade: number[]
  pago: boolean
  dataRegistro: Date
}
