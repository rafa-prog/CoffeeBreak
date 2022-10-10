import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.scss']
})
export class CadastroFuncionarioComponent implements OnInit {
  nome = new FormControl('',[Validators.required, Validators.minLength(4)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  senha = new FormControl('',[Validators.required, Validators.minLength(4)]);
  minDate: Date;
  maxDate: Date;

  constructor(
  private router: Router,
  private authFireService: AuthFirebaseService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
   }

  ngOnInit(): void {}

  getErrorMessageNome(){
    if(this.nome.hasError('required')){
      return 'Coloque uma nome válida!';
    }
      return this.nome.hasError('nome') ? 'não é um nome válido': '';
  
  }
  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Coloque um email válido!';
    }
      return this.email.hasError('email') ? 'não é um email válido' : '';
  }
  getErrorMessageSenha(){
    if(this.senha.hasError('required')){
      return 'Coloque uma senha válida!';
    }
      return this.senha.hasError('senha') ? 'não é uma senha válida': '';
  }
  criarConta() {
    let conta = {email: 'teste@gmail.com', senha: '12345'}
    this.authFireService.createUser(conta)
    .then((userCredential) => {
      const user = userCredential.user;
      this.irParaHome()
      console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error)
    });
  }

  irParaHome() {
    this.router.navigate(['/#'])
  }

}
