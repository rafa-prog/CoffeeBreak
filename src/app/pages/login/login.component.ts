import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  FormLogin!: FormGroup;
  isSubmitted!: boolean;
  calldiameter: boolean =false;
  diameter: number = 10;

  constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private authFireService: AuthFirebaseService) {}

  ngOnInit(): void {
    this.isSubmitted = false;
    this.formInit()
  }

  formInit() {
    this.FormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  getErrorControl(control: string, error: string): boolean {
    return this.FormLogin.controls[control].hasError(error)
  }

  async onSubmit() {
    this.isSubmitted = true

    if(!this.FormLogin.valid) {
      this.isSubmitted = false
      this.FormLogin.reset()
      alert('Login ou senha inválidos')
      return false
    }

    this.diameter = 100

    this.login()
    return true
  }

  private async login() {
    await this.authFireService.signIn(this.FormLogin.value)
    .then((userCredential) => {
      this.calldiameter = true;
      this.diameter = 10
      this.calldiameter=false;
      const user = userCredential.user;
      alert('Autenticado com sucesso!')

      this.irParaHome()
    })
    .catch(() => {
      this.FormLogin.reset()
      alert('Credenciais incorretas ou usuário não cadastrado!')
    });

  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-funcionario'])
  }
}
