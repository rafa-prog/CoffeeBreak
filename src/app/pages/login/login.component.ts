import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  constructor(
  private formBuilder: FormBuilder,
  private auth: Auth) {
    this.formLogin = this.formBuilder.group(
    {
      email: ['', [Validators.required]], // + email val
      senha: ['', Validators.required]
    })
  }

  ngOnInit(): void {

  }

  onSubmit() {
    createUserWithEmailAndPassword(this.auth, this.formLogin.controls['email'].value, this.formLogin.controls['senha'].value)
  }

}
