import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from 'src/app/models/produto';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  produtos: Produto[] = [];
  btnParam: string = '';
  categoria: string = '';

  constructor(private router: Router,
    private authFireService: AuthFirebaseService,
    private produtoFs: ProdutoFirebaseService) { }

  ngOnInit(): void {
    this.carregarProdutos()
    let user = this.authFireService.usuarioLogado()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        alert(profile.email)
      })
    }else {
      this.irParaLogin()
    }
  }

  carregarProdutos() {
    this.produtoFs.readProdutos().subscribe((data: Produto[]) => {this.produtos = data})
/*
    for(let p of this.produtos) [
      this.categoria.push(p.categoria.toString())
    ]*/
  }

  changeCat(param: string) {
    this.categoria = 'Bebidas Quentes'
    console.log('trocando para: ' + param)
    this.btnParam = param
    
    console.log(this.btnParam)
    console.log(this.categoria)
  }

  sairSessao() {
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

  irParaDetalhar() {
    this.router.navigateByUrl('/detalhes-produto')
  }

}
