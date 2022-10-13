import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  produtos: Produto[] = []
  produto!: Produto

  comandas: Comanda[] = []

  isAdmin: boolean = false;
  userEmail!: string;

  quantidade: number[] = []
  quantidadeProduto!: number;

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,
  private comandaFs: ComandaFirebaseService,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) {
    this.produto = this.router.getCurrentNavigation()!.extras.state as Produto;

    if(this.produto === undefined) {
      this.irParaHome()
    }
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
    this.formInit()
  }

  formInit() {
    this.FormComanda = this.formBuilder.group({
      mesa: ['', [Validators.required]]
    })
  }

  getErrorControl(control: string, error: string): boolean {
    return this.FormComanda.controls[control].hasError(error)
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormComanda.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.checkComanda()
    return true
  }

  private checkComanda() {
    this.comandaFs.readComandas()
    .subscribe((data: Comanda[]) => {this.comandas = data.filter(comanda => comanda.mesa === this.FormComanda.value)})

    console.log(this.produto)
    this.produtos.push(this.produto)
    this.quantidade.push(this.quantidadeProduto)

    if(this.comandas.length > 0) {
      this.comandaFs.updateComanda(this.comandas[0].id, this.comandas[0])
      this.irParaComanda(this.comandas[0])
    }else {
      let comanda = {id: '', mesa: this.FormComanda.value, produtos: this.produtos, quantidade: this.quantidade}
      this.comandaFs.createComanda(comanda)
    }
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
