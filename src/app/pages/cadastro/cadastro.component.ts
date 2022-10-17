import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { Produto } from 'src/app/models/produto';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  FormBusca!: FormGroup;

  produtos: Produto[] = [];
  funcionarios: Funcionario[] = [];

  isAdmin: boolean = false;
  userEmail!: string;

  readonly separatorKeysCodes = [ENTER] as const
  addOnBlur = true;

  tipo!: (string | null);
  categoria: string = '';
  busca: string = '';

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  private produtoFs: ProdutoFirebaseService,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipo = params.get('tipo');
    });

    if(this.tipo === 'produtos') {
      this.searchByCategory('Produtos');
    }else {
      this.searchByCategory('Funcionários');
    }

    let user = this.authFireService.userLogged()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        this.userEmail = profile.email
      })
    }else {
      this.irParaLogin()
    }

    if(this.userEmail) {
      this.funcionarioFs.produtoQueryByEmail(this.userEmail).then(data => {
        if(data){
        this.isAdmin = data.admin
        }else {
          this.isAdmin = false
          this.irParaHome()
        }
      })
    }

    this.FormBusca = this.formBuilder.group({busca: ['']})
  }

  carregarProdutos() {
    return this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.carregarParametros(data, 'Produtos')})
  }

  carregarFuncionarios() {
    this.funcionarioFs.readFuncionarios().subscribe((data: Funcionario[]) => {this.carregarParametros(data, 'Funcionários')})
  }

  carregarParametros(data: any, categoria: string) {
    if(categoria === 'Produtos') {
      if(this.busca) {
        this.produtos = data.filter((produto: any) => produto.nome.toLowerCase().includes(this.busca.toLowerCase()))
      }else {
        this.produtos = data
      }
    }else if(categoria === 'Funcionários') {
      if(this.busca) {
        this.funcionarios = data.filter((funcionarios: any) => funcionarios.nome.toLowerCase().includes(this.busca.toLowerCase()))
      }else {
        this.funcionarios = data
      }
    }

  }


  addCategory(categoria: string){
    this.categoria = categoria;
  }

  addSearch(busca: string) {
    this.busca = busca;
  }

  searchByText(busca: string){
    this.addSearch(busca)

    this.searchByCategory(this.categoria)

    if(this.busca === 'Funcionários'){
      this.carregarFuncionarios()
    }else if(this.busca === 'Produtos'){
      this.carregarProdutos()
    }

    return '';
  }

  searchByCategory(categoria: string) {
    this.addCategory(categoria);

    if(categoria === 'Funcionários') {
      this.router.navigate(['/gerenciar/funcionarios'])
      this.produtos = [];
      this.carregarFuncionarios();
    }else {
      this.router.navigate(['/gerenciar/produtos'])
      this.funcionarios = [];
      this.carregarProdutos();
    }
  }

  removeCategory(){
    this.categoria = '';
  }

  removeSearch(){
    this.busca = '';

    if(this.categoria === 'Funcionários') {
      this.produtos = [];
      this.carregarFuncionarios();
    }else {
      this.funcionarios = [];
      this.carregarProdutos();
    }
  }

  excluirFuncionario(funcionario: Funcionario) {
    this.funcionarioFs.deleteFuncionario(funcionario);
  }

  excluirProduto(produto: Produto) {
    this.produtoFs.deleteProduto(produto)
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

  irParaEditarFuncionario(funcionario: Funcionario){
    this.router.navigateByUrl('/editar-funcionario', { state: funcionario})
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }
}
