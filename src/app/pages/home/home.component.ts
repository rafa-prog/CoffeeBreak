import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { Categoria } from 'src/app/models/categoria';
import { Produto } from 'src/app/models/produto';

import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';
import { ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComandaFirebaseService } from 'src/app/services/comanda.firebase.service';
import { Comanda } from 'src/app/models/comanda';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  FormBusca!: FormGroup;

  comandas: Comanda[] = [];
  comanda!: Comanda;

  produtos: Produto[] = [];
  categorias!: string[];

  isAdmin: boolean = true; // aAAAAAA
  userEmail!: string;

  readonly separatorKeysCodes = [ENTER] as const
  addOnBlur = true;

  categoria: string = '';
  busca: string = '';

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  private produtoFs: ProdutoFirebaseService,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) { }

  ngOnInit(): void {
    let user = this.authFireService.userLogged() // Verifica login
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
        }
      })
    }

    this.categorias = Object.keys(Categoria).filter((res) => isNaN(Number(res)));

    this.carregarProdutos()
    this.carregarComandas()

    setTimeout(() => {this.comandas = this.comandas.filter(comanda => !comanda.pago); this.comanda = this.comandas[0]}, 3000);

    this.FormBusca = this.formBuilder.group({busca: ['']})
  }

  carregarProdutos() {
    return this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.carregarParametros(data)})
  }

  async carregarComandas() {
    return await this.comandaFs.readComandas().subscribe((data: Comanda[]) => {this.comandas = data;})
  }

  carregarParametros(data: any) {
    if(this.busca) {
      this.produtos = data.filter((produto: any) => produto.nome.toLowerCase().includes(this.busca.toLowerCase()))
    }else {
      this.produtos = data
    }
  }

  addCategory(param: string) {
    if(this.categoria !== param){
    this.categoria = param
    }
  }

  removeCategory(): void {
    this.categoria = ''
    this.carregarProdutos()
  }

  addSearch(param: string) {
    if(this.busca !== param){
      this.busca = param
    }
  }

  removeSearch(): void {
    this.busca = ''

    if(this.categoria) {
      this.searchByCategory(this.categoria)
    }else {
      this.carregarProdutos()
    }
  }

  searchByCategory(categoria: string) {
    this.addCategory(categoria)

    this.produtoFs.produtoQueryByCategoria(this.categoria).then(data => {
      this.carregarParametros(data)
    })
  }

  searchByText(busca: string) {
    this.addSearch(busca)

    if(this.categoria) {
      this.searchByCategory(this.categoria)
    }else {
      this.carregarProdutos()
    }

    return ''
  }

  disconnect() {
    this.authFireService.signOut()
    .then(() => {
      alert("usuário desconectado!")
      this.irParaLogin()
    }).catch((error) => {
      alert(error)
    });
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }

  irParaCadastro() {
    this.router.navigate(['/gerenciar/funcionarios'])
  }

  irParaPagamento() {
    this.router.navigate(['/pagamento'])
  }

  irParaComanda() {
    this.router.navigateByUrl('/comanda', {state : this.comanda})
  }

  irParaMaisDetalhes(produto: Produto, quantidade: number) {
    this.router.navigateByUrl('/mais-detalhes', { state: {produto: produto, quantidade: quantidade}})
  }
}
