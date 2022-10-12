import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { Categoria } from 'src/app/models/categoria';
import { Produto } from 'src/app/models/produto';

import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  produtos: Produto[] = [];
  categorias!: string[];

  isAdmin: boolean = false;
  userEmail!: string;

  categoria: string = '';
  busca: string = '';

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private produtoFs: ProdutoFirebaseService,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) { }

  ngOnInit(): void {
    /*let user = this.authFireService.userLogged() // Verifica login
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        this.userEmail = profile.email
      })
    }else {
      this.irParaLogin()
    }*/

    this.funcionarioFs.readFuncionarios() // Verifica se o usuário logado é administrador
    .subscribe((data: Funcionario[]) => {
      let funcionarios = data.filter(funcionario => funcionario.email === this.userEmail)

      if(funcionarios.length > 0) {
        this.isAdmin = funcionarios[0].admin
      }
    })

    this.isAdmin = true // Remover DEPOS AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    this.categorias = Object.keys(Categoria).filter((res) => isNaN(Number(res)));

    this.carregarProdutos()
  }

  carregarProdutos() {
    return this.produtoFs.readProdutos().subscribe((data: Produto[]) => {
      this.route.queryParams
      .subscribe((queryParams: any) => {

        if(queryParams['category'] && queryParams['search']) {

          this.categoria = queryParams['category']
          this.busca = queryParams['search']

          this.produtos = data.filter(produto => produto.categoria === this.categoria &&
          produto.nome.toLowerCase().includes(this.busca.toLowerCase()))

        }else if(queryParams['search']) {

          this.busca = queryParams['search']
          this.produtos = data.filter(produto => produto.nome.toLowerCase().includes(this.busca.toLowerCase()))

        }else if(queryParams['category']) {

          this.categoria = queryParams['category']
          this.produtos = data.filter(produto => produto.categoria === this.categoria)
        }else {
          this.produtos = data
        }
      })
    })
  }

  searchByCategory(categoria: string) {
    this.router.navigate(['/home'], { queryParams: {category: categoria}})
  }

  searchByText(teste: string) {
    this.router.navigate(['/home'], { queryParams: {category: this.categoria, search: teste}})
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
    this.router.navigate(['/cadastro'])
  }

  irParaComanda(){
    this.router.navigateByUrl('/comanda')
  }

  irParaMaisDetalhes(){
    this.router.navigateByUrl('/mais-detalhes')
  }
}
