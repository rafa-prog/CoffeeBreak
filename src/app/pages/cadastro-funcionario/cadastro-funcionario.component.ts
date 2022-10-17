import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.scss']
})

export class CadastroFuncionarioComponent implements OnInit {
  isAdmin!: boolean;
  isSubmitted!: boolean;
  FormCadFunc!: FormGroup;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private authFireService: AuthFirebaseService) {}

  ngOnInit(): void {
    /*
    let user = this.authFireService.userLogged()
    if(user !== null) {
      user.providerData.forEach((profile: any) => {
        alert(profile.email)
      })
    }else {
      this.irParaLogin()
    }
    */
    this.formInit();
  }

  formInit() {
    this.FormCadFunc = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.minLength(10)]],
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

  private createConta() {
    let funcionario: Funcionario = {id: '', nome: this.FormCadFunc.controls['nome'].value, telefone: this.FormCadFunc.controls['telefone'].value,
    email: this.FormCadFunc.controls['email'].value, admin: this.isAdmin}

    this.authFireService.createUser(funcionario, this.FormCadFunc.controls['senha'].value)
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
