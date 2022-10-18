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

  comandas: Comanda[] = [];
  comanda!: Comanda

  mesaValida: boolean = false;
  mesa!: number;

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
    this.produto = this.router.getCurrentNavigation()!.extras.state!['produto'] as Produto;
    this.quantidadeProduto = this.router.getCurrentNavigation()!.extras.state!['quantidadeProduto'] as number;
    this.mesa = this.router.getCurrentNavigation()!.extras.state!['mesa'] as number;

    if(this.produto === null) {
      this.irParaHome()
    }

    if(!this.quantidadeProduto) {
      this.quantidadeProduto = 1
    }

    if(this.mesa) {
      this.mesaValida = true;
    }

    this.precoTotal = this.produto.preco
  }

  ngOnInit(): void {
    let user = this.authFireService.userLogged() // Verifica login
    if(user === null) {
      this.irParaLogin()
    }
    
    this.carregaComandas()
  }

  async salvaStatusComanda(mesa: number) {
    if(this.mesa) {
      mesa = this.mesa
    }

    let comandasFitraldas = this.comandas.filter(comanda => comanda.mesa === mesa && !comanda.pago)

    this.comanda = comandasFitraldas[0];

    if(this.comanda) {

      this.comanda.produtos.push(this.produto);
      this.comanda.quantidade.push(this.quantidadeProduto);
      this.comanda.dataRegistro = new Date();

      await this.comandaFs.updateComanda(this.comanda)
      .then(() => alert('Comanda atualizada!'))

      this.irParaComanda(this.comanda)

    } else {

      let produtos: Produto[] = [this.produto];
      let quantidade: number[] = [this.quantidadeProduto];

      let comanda = {id: '', mesa: mesa, produtos: produtos, quantidade: quantidade, pago: false, dataRegistro: new Date()}

      await this.comandaFs.createComanda(comanda)

      this.irParaComanda(comanda)
    }

    return ''
  }

  async carregaComandas() {
    return await this.comandaFs.readComandas().subscribe((data: Comanda[]) => {this.comandas = data;})
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

  irParaComanda(comanda: Comanda) {
    this.router.navigateByUrl('/comanda', {state : comanda})
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }
}
