import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { Produto } from 'src/app/models/produto';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';
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
  funcionarios: Funcionario[] = [];

  constructor(
  private router: Router,
  private produtoFs: ProdutoFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) { }

  ngOnInit(): void {
    this.carregarFuncionarios()
    this.carregarProdutos()
  }

  carregarProdutos() {
    this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.produtos = data})
  }

  carregarFuncionarios() {
    this.funcionarioFs.readFuncionarios().subscribe((data: Funcionario[]) => {this.funcionarios = data})
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
