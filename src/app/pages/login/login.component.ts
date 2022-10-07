import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medida } from 'src/app/models/medida';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { AuthFirebaseService } from 'src/app/services/auth.firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  FormLogin: FormGroup = this.formBuilder.group({})
  isSubmitted: boolean = false
  teste: string = ''
  categorias: (Medida | string)[] = []
  medidas: string[] = []
  image:any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authFireService: AuthFirebaseService) { }

  ngOnInit(): void {
    this.categorias = Object.values(Categoria)
    this.medidas = Object.keys(Medida).filter((res) => isNaN(Number(res)))
    this.formInit()
  }

  formInit() {
    this.FormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
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

  get errorControl() {
    return this.FormLogin.controls
  }

  private login() {
    this.authFireService.signIn(this.FormLogin.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      alert('Autenticado com sucesso!')
      this.irParaHome()
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

  irParaCadastro() {
    this.router.navigate(['/cadastro-funcionario'])
  }

}
