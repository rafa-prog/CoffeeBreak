import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';
import { FuncionarioFirebaseService } from 'src/app/services/funcionario.firebase.service';

@Component({
  selector: 'app-editar-funcionario',
  templateUrl: './editar-funcionario.component.html',
  styleUrls: ['./editar-funcionario.component.scss']
})
export class EditarFuncionarioComponent implements OnInit {
  funcionario: Funcionario;

  isAdmin: boolean = false;
  userEmail!: string;

  isSubmitted!: boolean;
  FormEditFunc!: FormGroup;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private authFireService: AuthFirebaseService,
  private funcionarioFs: FuncionarioFirebaseService) {
    this.funcionario = this.router.getCurrentNavigation()!.extras.state as Funcionario;

    if(this.funcionario === undefined) {
      this.irParaCadastro()
    }

    this.isAdmin = this.funcionario.admin
  }

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
    this.FormEditFunc = this.formBuilder.group({
      nome: [this.funcionario.nome, [Validators.required, Validators.minLength(3)]],
      telefone: [this.funcionario.telefone, [Validators.required, Validators.minLength(10)]],
      email: [this.funcionario.email, [Validators.required, Validators.email]]
    })
  }

  changePermAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  getErrorControl(control: string, error: string): boolean {
    return this.FormEditFunc.controls[control].hasError(error)
  }

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormEditFunc.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.editarConta()
    return true
  }

  private async editarConta() {
    let funcionario = {id: this.funcionario.id, nome: this.FormEditFunc.controls['nome'].value, email: this.FormEditFunc.controls['email'].value,
    telefone: this.FormEditFunc.controls['telefone'].value, admin: this.isAdmin}
    await this.funcionarioFs.updateFuncionario(funcionario)

    this.irParaCadastro()
  }

  trocarSenha() {
    this.authFireService.updateUser(this.funcionario.email)
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
