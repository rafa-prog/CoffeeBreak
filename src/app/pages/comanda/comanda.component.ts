import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comanda } from 'src/app/models/comanda';
import { Produto } from 'src/app/models/produto';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { ComandaFirebaseService } from 'src/app/services/comanda.firebase.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss']
})
export class ComandaComponent implements OnInit {
  produtos!: Produto[]
  quantidade!: number[]

  comanda: Comanda;

  precoTotal: number = 0;

  quantidadeProduto: number = 1

  constructor(
  private router: Router,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService) {
    this.comanda = this.router.getCurrentNavigation()!.extras.state as Comanda;

    if(this.comanda === undefined) {
      alert('Ocorreu um erro ao acessar a comanda, tente novamente!')
      this.irParaHome()
    }
  }

  ngOnInit(): void {
    let user = this.authFireService.userLogged()
    if(user === null) {
    this.irParaLogin()
    }
   this.atualizaPrecoTotal()
  }

  async excluirComanda() {
    await this.comandaFs.deleteComanda(this.comanda);
    alert('Comanda excluída com sucesso!');
    this.irParaHome();
  }

  async excluirProduto(produto: Produto) {
    this.comanda.produtos.forEach((value, index) => {
      if(value === produto) {
        this.comanda.produtos.splice(index, 1);
        this.comanda.quantidade.splice(index, 1);
      }
    })

    this.atualizaPrecoTotal();
    if(this.comanda.produtos.length > 0) {
      await this.comandaFs.updateComanda(this.comanda)
    }else {
      this.excluirComanda()
    }
  }

  atualizaPrecoTotal() {
    this.comanda.produtos.forEach((element, index) => {
      this.precoTotal += element.preco * this.comanda.quantidade[index];
    });
  }

  async realizarPagamento() {
    if(this.comanda.pago) {
      alert('Esta comanda já está paga');
      this.irParaHome();
    }else {
      this.comanda.pago = true;
      await this.comandaFs.updateComanda(this.comanda)
      .then(() => alert('Comanda atualizada!'));
      this.irParaHome();
    }
  }

  add(quantidade: number) {
    quantidade += 1
  }

  sub(quantidade: number) {
    quantidade -= 1
  }

  async irParaMaisDetalhes(produto: Produto, quantidade: number) {
    this.excluirProduto(produto)
    this.router.navigateByUrl('/mais-detalhes', { state: {produto: produto, quantidade: quantidade, mesa: this.comanda.mesa}})
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }
}
