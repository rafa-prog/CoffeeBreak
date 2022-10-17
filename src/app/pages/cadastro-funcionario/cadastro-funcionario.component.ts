import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.scss']
})

export class CadastroFuncionarioComponent implements OnInit {
  isAdmin: boolean = false;
  userEmail!: string;

  isSubmitted!: boolean;
  FormCadFunc!: FormGroup;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) {}

  ngOnInit(): void {
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

    this.formInit();
  }

  formInit() {
    this.FormCadFunc = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  changePermAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  getErrorControl(control: string, error: string): boolean {
    return this.FormCadFunc.controls[control].hasError(error)
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormCadFunc.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.createConta()
    return true
  }

  private async createConta() {
    let funcionario: Funcionario = {id: '', nome: this.FormCadFunc.controls['nome'].value, telefone: this.FormCadFunc.controls['telefone'].value,
    email: this.FormCadFunc.controls['email'].value, admin: this.isAdmin}

    await this.authFireService.createUser(funcionario, this.FormCadFunc.controls['senha'].value);

    this.irParaCadastro()
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaLogin() {
    this.router.navigate(['/'])
  }
  irParaCadastro(){
    this.router.navigate(['/gerenciar/funcionarios'])
  }
}
