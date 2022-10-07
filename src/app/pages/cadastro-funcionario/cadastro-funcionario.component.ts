import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.scss']
})
export class CadastroFuncionarioComponent implements OnInit {

  constructor(
  private router: Router,
  private authFireService: AuthFirebaseService) { }

  ngOnInit(): void {}

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
