import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from 'src/app/models/produto';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  categorias!: string[];

  panelOpenState!: boolean[];

  isAdmin: boolean = false;
  userEmail!: string;

  readonly separatorKeysCodes = [ENTER] as const
  addOnBlur = true;

  categoria: string = '';
  busca: string = '';
  produtos: Produto[] = [];

  constructor(
  private router: Router,
  private produtoFs: ProdutoFirebaseService) { }

  ngOnInit(): void {
    this.carregarProdutos()
  }

  carregarProdutos() {
    this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.produtos = data})
  }

  irParaCadastroProduto() {
    this.router.navigate(['/cadastro-produto'])
  }

  irParaCadastroFuncionario(){
    this.router.navigateByUrl('/cadastro-funcionario')
  }

  irParaEditarProduto(produto: Produto){
    this.router.navigateByUrl('/editar-produto', { state: produto})
  }
  irParaHome() {
    this.router.navigate(['/home'])
  }
  addCategory(categoria:string){
    this.categoria = categoria;
  }
  searchByText(busca:string){
    this.busca = busca;
    return '';
  }
  removeCategory(){
    this.categoria='';
  }
  removeSearch(){
    this.busca='';
  }
}
