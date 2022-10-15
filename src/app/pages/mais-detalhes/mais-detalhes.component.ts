import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Adicional } from 'src/app/models/adicional';
import { Comanda } from 'src/app/models/comanda';
import { Funcionario } from 'src/app/models/funcionario';
import { Produto } from 'src/app/models/produto';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { ComandaFirebaseService } from 'src/app/services/comanda.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';

@Component({
  selector: 'app-mais-detalhes',
  templateUrl: './mais-detalhes.component.html',
  styleUrls: ['./mais-detalhes.component.scss']
})
export class MaisDetalhesComponent implements OnInit {
  FormComanda!: FormGroup
  isSubmitted: boolean = false;

  comanda!: Comanda

  precoTotal: number

  quantidadeProduto!: number;
  produto!: Produto

  isAdmin: boolean = false;
  userEmail!: string;

  constructor(
  private router: Router,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) {
    this.produto = this.router.getCurrentNavigation()!.extras.state as Produto;

    console.log(this.produto)
    if(this.produto === undefined) {
      this.irParaHome()
    }

    this.precoTotal = this.produto.preco
  }

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
    this.quantidadeProduto = 1
  }

  async checkComanda(mesa: number) {
    await this.comandaFs.comandaQueryByMesa(mesa).then((data: Comanda) => this.comanda = data)

    if(this.comanda) {

      this.comanda.produtos.push(this.produto)
      this.comandaFs.updateComanda(this.comanda.id, this.comanda)

    } else {

      let produtos: Produto[] = [this.produto];
      let quantidade: number[] = [this.quantidadeProduto];

      let comanda = {id: '', mesa: mesa, produtos: produtos, quantidade: quantidade}

      this.comandaFs.createComanda(comanda)
    }

    this.irParaComanda(this.comanda)
    return ''
  }

  add() {
    this.quantidadeProduto += 1
  }

  sub() {
    this.quantidadeProduto -= 1
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaComanda(param: Comanda) {
    this.router.navigateByUrl('/comanda', {state : {comanda: param}})
  }
}
