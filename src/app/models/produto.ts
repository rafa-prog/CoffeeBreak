import { Adicional } from "./adicional"
import { Categoria } from "./categoria"
import { Medida } from "./medida"

export interface Produto {
    id: any
    nome: string
    descricao: string
    categoria: Categoria
    tamanho: number
    medida: Medida
    adicionais: Adicional[]
    foto: any 
    preco: number
}
