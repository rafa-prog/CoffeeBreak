import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'
import { Medida } from 'src/app/models/medida';
import { Router } from '@angular/router';
import { ProdutoFirebaseService } from 'src/app/services/produto.firebase.service';
import { Categoria } from 'src/app/models/categoria';

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
    private produtoFs: ProdutoFirebaseService) { }

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
    
  }

}
