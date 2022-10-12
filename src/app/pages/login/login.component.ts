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

  onSubmit(): boolean {
    this.isSubmitted = true
    if(!this.FormLogin.valid) {
      alert("Todos os campos são obrigatórios!")
      return false
    }

    this.login()
    return true
  }

  private login() {
    this.authFireService.signIn(this.FormLogin.value)
    .then((userCredential) => {
      const user = userCredential.user;
      alert('Autenticado com sucesso!')
      this.irParaHome()
    })
    .catch((error) => {
      this.FormLogin.reset()
      alert(error)
    });
  }

  irParaHome() {
    this.router.navigate(['/home'])
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-funcionario'])
  }
}
